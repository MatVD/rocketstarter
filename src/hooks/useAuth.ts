import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    setOnboardingComplete,
    setOnboardingStep,
    isAuthenticating,
    setIsAuthenticating,
    logout,
  } = useUserStore();

  // Handle authentication flow when wallet connects
  useEffect(() => {
    let mounted = true;
    const { setUserLoading } = useUserStore.getState();

    const authenticateUser = async () => {
      // Guard: Prevent multiple simultaneous authentication attempts
      if (isAuthenticating) {
        setUserLoading(false);
        console.log('🔒 Authentication already in progress, skipping...');
        return;
      }

      // Skip if already authenticated with same address
      if (user && user.address === address && isAuthenticated) {
        setUserLoading(false);
        console.log('[useAuth] Déjà authentifié avec cette adresse:', address);
        return;
      }

      // Logout if wallet disconnected
      if (!address || !isConnected) {
        if (mounted && (user || isAuthenticated)) {
          await logout();
          navigate('/'); // Redirect to onboarding/login page
        }
        setUserLoading(false);
        return;
      }

      // Set guard flag
      setIsAuthenticating(true);
      setAuthLoading(true);
      setAuthError(null);
      setUserLoading(true);

      try {
        // Step 1: Check if already authenticated (valid cookie)
        console.log('[useAuth] Vérification du cookie JWT...');
        const hasValidCookie = await checkAuthStatus();
        console.log('[useAuth] Résultat checkAuthStatus:', hasValidCookie);
        
        if (hasValidCookie) {
          // Cookie is valid, just fetch user data
          try {
            const fetchedUser = await getUserByAddress(address);
            console.log('[useAuth] Utilisateur trouvé:', fetchedUser);
            if (mounted) {
              setUser({ ...fetchedUser, address });
              setIsAuthenticated(true);
              setOnboardingComplete(true);
              setOnboardingStep(3);
              console.log('[useAuth] Authentification réussie, isAuthenticated TRUE');
            }
            setUserLoading(false);
            return;
          } catch (error) {
            console.warn('[useAuth] Utilisateur non trouvé en DB, onboarding nécessaire');
            if (mounted) {
              setIsAuthenticated(false);
              setOnboardingComplete(false);
              setOnboardingStep(2);
              console.log('[useAuth] Utilisateur non trouvé, isAuthenticated FALSE');
            }
            setUserLoading(false);
            return;
          }
        }

        // Step 2: No valid cookie, start JWT authentication flow
        console.log('[useAuth] Pas de cookie valide, démarrage du flow JWT...');
        const challengeData = await requestChallenge(address);
        console.log('[useAuth] Challenge reçu:', challengeData);

        // Step 3: Sign the challenge message with wallet
        const signature = await signMessageAsync({ message: challengeData.message });
        console.log('[useAuth] Signature obtenue:', signature);

        // Step 4: Verify signature and get JWT cookie
        await verifySignature(address, signature);
        console.log('[useAuth] Signature vérifiée, cookie JWT devrait être posé');

        // Step 5: Fetch user data (now authenticated with cookie)
        try {
          const fetchedUser = await getUserByAddress(address);
          console.log('[useAuth] Utilisateur après vérification:', fetchedUser);
          if (mounted) {
            setUser({ ...fetchedUser, address });
            setIsAuthenticated(true);
            setOnboardingComplete(true);
            setOnboardingStep(3);
          }
          setUserLoading(false);
        } catch (error) {
          console.warn('[useAuth] Utilisateur authentifié mais non présent en DB, onboarding nécessaire');
          if (mounted) {
            setIsAuthenticated(true); // Has valid JWT
            setOnboardingComplete(false); // But needs to complete profile
            setOnboardingStep(2);
          }
          setUserLoading(false);
        }
      } catch (error) {
        console.error('[useAuth] Erreur d’authentification:', error);
        
        if (mounted) {
          const errorMessage = error instanceof Error ? error.message : "Authentication failed";
          setAuthError(errorMessage);
          setIsAuthenticated(false);
          setOnboardingComplete(false);
          setUser(undefined);
        }
        setUserLoading(false);
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
        // Release guard flag to allow future authentication attempts
        setIsAuthenticating(false);
        console.log('[useAuth] Fin du flow, isAuthenticated:', isAuthenticated);
      }
    };

    if (isConnected && address) {
      authenticateUser();
    } else {
      setUserLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [
    isConnected,
    address,
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
