import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { getUserByAddress } from "../api/users";
import { requestChallenge, verifySignature } from "../api/auth";
import { checkAuthStatus } from "../api/client";
import { useUserStore } from "../store/user.store";

/**
 * Central authentication hook with Web3 JWT flow
 * Flow: wallet connect → challenge → sign → verify → JWT cookie → fetch user
 */
export function useAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    onboardingComplete,
    setOnboardingComplete,
    setOnboardingStep,
    logout,
  } = useUserStore();

  // Handle authentication flow when wallet connects
  useEffect(() => {
    let mounted = true;

    const authenticateUser = async () => {
      // Skip if already authenticated with same address
      if (user && user.address === address && isAuthenticated) {
        return;
      }

      // Logout if wallet disconnected
      if (!address || !isConnected) {
        if (mounted && (user || isAuthenticated)) {
          await logout();
        }
        return;
      }

      setAuthLoading(true);
      setAuthError(null);

      try {
        // Step 1: Check if already authenticated (valid cookie)
        const hasValidCookie = await checkAuthStatus();
        
        if (hasValidCookie) {
          // Cookie is valid, just fetch user data
          try {
            const fetchedUser = await getUserByAddress(address);
            if (mounted) {
              setUser({ ...fetchedUser, address });
              setIsAuthenticated(true);
              setOnboardingComplete(true);
              setOnboardingStep(3);
            }
            return;
          } catch (error) {
            // User not found in DB, need to onboard
            console.log("User not found, needs onboarding");
            if (mounted) {
              setIsAuthenticated(false);
              setOnboardingComplete(false);
              setOnboardingStep(2);
            }
            return;
          }
        }

        // Step 2: No valid cookie, start JWT authentication flow
        // Request challenge from backend
        const { message } = await requestChallenge(address);

        // Step 3: Sign the challenge message with wallet
        const signature = await signMessageAsync({ message });

        // Step 4: Verify signature and get JWT cookie
        await verifySignature(address, signature);

        // Step 5: Fetch user data (now authenticated with cookie)
        try {
          const fetchedUser = await getUserByAddress(address);
          if (mounted) {
            setUser({ ...fetchedUser, address });
            setIsAuthenticated(true);
            setOnboardingComplete(true);
            setOnboardingStep(3);
          }
        } catch (error) {
          // User authenticated but not in DB, needs onboarding
          console.log("User authenticated but not found, needs onboarding");
          if (mounted) {
            setIsAuthenticated(true); // Has valid JWT
            setOnboardingComplete(false); // But needs to complete profile
            setOnboardingStep(2);
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
        if (mounted) {
          setAuthError(
            error instanceof Error ? error.message : "Authentication failed"
          );
          setIsAuthenticated(false);
          setOnboardingComplete(false);
          setUser(undefined);
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    if (isConnected && address) {
      authenticateUser();
    }

    return () => {
      mounted = false;
    };
  }, [
    isConnected,
    address,
    user,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
    setOnboardingComplete,
    setOnboardingStep,
    signMessageAsync,
    logout,
  ]);

  // Listen for logout events (from 401 errors)
  useEffect(() => {
    const handleLogout = () => {
      logout();
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [logout]);

  return {
    user,
    isConnected,
    isAuthenticated,
    authLoading,
    authError,
  };
}
