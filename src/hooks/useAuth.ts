import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { getUserByAddress } from "../api/users";
import { requestChallenge, verifySignature } from "../api/auth";
import { checkAuthStatus } from "../api/client";
import { useUserStore } from "../store/user.store";

/**
 * Central authentication hook with Web3 JWT flow
 * Flow: wallet connect → challenge → sign → verify → JWT cookie → fetch user
 * 
 * CRITICAL: This hook reads user state INSIDE the useEffect to get fresh values
 * when the wallet disconnects.
 */
export function useAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Only subscribe to user for the return value (not used in useEffect logic)
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  // Handle authentication flow when wallet connects/disconnects
  useEffect(() => {
    console.log('[useAuth] useEffect triggered', { 
      address, 
      isConnected
    });
    
    let mounted = true;
    
    const authenticateUser = async () => {
      // Read FRESH values from store INSIDE useEffect
      const store = useUserStore.getState();
      const currentUser = store.user;
      const currentIsAuthenticated = store.isAuthenticated;
      const isAuthenticating = store.isAuthenticating;
      
      console.log('[useAuth] Current store state:', { 
        currentUser: currentUser?.address, 
        currentIsAuthenticated,
        walletConnected: isConnected,
        walletAddress: address
      });

      // Logout if wallet disconnected but user still in store
      if ((!address || !isConnected) && (currentUser || currentIsAuthenticated)) {
        console.log('[useAuth] Wallet disconnected but user still in store, starting logout...');
        
        // Use synchronous logout with beacon to guarantee request completion
        store.logoutSync();
        
        console.log('[useAuth] State cleared with beacon, redirecting to onboarding...');
        
        // Navigate immediately - beacon guarantees the logout request will complete
        window.location.href = '/onboarding';
        return;
      }

      // Skip if no wallet connected
      if (!address || !isConnected) {
        console.log('[useAuth] No wallet connected and no user in store, nothing to do');
        store.setUserLoading(false);
        return;
      }

      // Guard: Prevent multiple simultaneous authentication attempts
      if (isAuthenticating) {
        console.log('[useAuth] Already authenticating, skipping');
        store.setUserLoading(false);
        return;
      }

      // Skip if already authenticated with same address
      if (currentUser && currentUser.address === address && currentIsAuthenticated) {
        console.log('[useAuth] Already authenticated with same address, skipping');
        store.setUserLoading(false);
        return;
      }

      // Start authentication process
      console.log('[useAuth] Starting authentication for address:', address);
      store.setIsAuthenticating(true);
      setAuthLoading(true);
      setAuthError(null);
      store.setUserLoading(true);

      try {
        // Step 1: Check if already authenticated (valid cookie)
        const hasValidCookie = await checkAuthStatus();
        
        if (hasValidCookie) {
          console.log('[useAuth] Valid cookie found, fetching user data...');
          // Cookie is valid, just fetch user data
          try {
            const fetchedUser = await getUserByAddress(address);
            if (mounted) {
              store.setUser({ ...fetchedUser, address });
              store.setIsAuthenticated(true);
              store.setOnboardingComplete(true);
              store.setOnboardingStep(3);
              console.log('[useAuth] User data fetched successfully');
            }
            store.setUserLoading(false);
            return;
          } catch (error) {
            console.error('[useAuth] Error fetching user data:', error);
            if (mounted) {
              store.setIsAuthenticated(false);
              store.setOnboardingComplete(false);
              store.setOnboardingStep(2);
            }
            store.setUserLoading(false);
            return;
          }
        }

        // Step 2: No valid cookie, start JWT authentication flow
        console.log('[useAuth] No valid cookie, starting challenge-response flow...');
        const challengeData = await requestChallenge(address);

        // Step 3: Sign the challenge message with wallet
        console.log('[useAuth] Requesting signature from wallet...');
        const signature = await signMessageAsync({ 
          message: challengeData.message,
        });

        // Step 4: Verify signature and get JWT cookie
        console.log('[useAuth] Verifying signature...');
        await verifySignature(address, signature);

        // Step 5: Fetch user data (now authenticated with cookie)
        console.log('[useAuth] Signature verified, fetching user data...');
        try {
          const fetchedUser = await getUserByAddress(address);
          if (mounted) {
            store.setUser({ ...fetchedUser, address });
            store.setIsAuthenticated(true);
            store.setOnboardingComplete(true);
            store.setOnboardingStep(3);
            console.log('[useAuth] Authentication complete!');
          }
          store.setUserLoading(false);
        } catch (error) {
          console.error('[useAuth] User not found, needs onboarding:', error);
          if (mounted) {
            store.setIsAuthenticated(true); // Has valid JWT
            store.setOnboardingComplete(false); // But needs to complete profile
            store.setOnboardingStep(2);
          }
          store.setUserLoading(false);
        }
      } catch (error) {
        console.error('[useAuth] Authentication error:', error);
        
        if (mounted) {
          const errorMessage = error instanceof Error ? error.message : "Authentication failed";
          setAuthError(errorMessage);
          store.setIsAuthenticated(false);
          store.setOnboardingComplete(false);
          store.setUser(undefined);
        }
        store.setUserLoading(false);
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
        // Release guard flag to allow future authentication attempts
        useUserStore.getState().setIsAuthenticating(false);
      }
    };

    authenticateUser();

    return () => {
      mounted = false;
    };
  }, [isConnected, address, signMessageAsync]);

  // Listen for logout events (from 401 errors)
  useEffect(() => {
    const handleLogout = async () => {
      console.log('[useAuth] Logout event received from 401 interceptor');
      await useUserStore.getState().logout();
      window.location.href = '/onboarding';
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  return {
    user,
    isConnected,
    isAuthenticated,
    authLoading,
    authError,
  };
}
