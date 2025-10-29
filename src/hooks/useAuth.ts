import { useEffect } from "react";
import { useAccount } from "wagmi";
import { getUserByAddress } from "../api/users";
import { useUserStore } from "../store/user.store";

/**
 * Hook centralisé pour gérer l'authentification et la vérification de l'utilisateur
 */
export function useAuth() {
  const { address, isConnected } = useAccount();
  const { user, setUser, onboardingComplete, setOnboardingComplete, setOnboardingStep } =
    useUserStore();

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      // Éviter les vérifications multiples
      if (user && user.address === address) {
        return;
      }

      // Déconnexion
      if (!address) {
        if (mounted) {
          setUser(undefined);
          setOnboardingComplete(false);
        }
        return;
      }

      try {
        const fetchedUser = await getUserByAddress(address);
        if (mounted) {
          setUser({ ...fetchedUser, address });
          setOnboardingComplete(true);
          setOnboardingStep(3);
        }
      } catch {
        if (mounted) {
          setUser(undefined);
          setOnboardingComplete(false);
        }
      }
    };

    if (isConnected && address) {
      checkUser();
    } else if (!isConnected && mounted) {
      setUser(undefined);
      setOnboardingComplete(false);
    }

    return () => {
      mounted = false;
    };
  }, [isConnected, address, setUser, setOnboardingComplete, user]);

  return {
    user,
    isConnected,
    isAuthenticated: isConnected && onboardingComplete,
  };
}
