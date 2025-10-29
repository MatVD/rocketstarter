import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { getUserByAddress } from "../api/users";
import { useUserStore } from "../store/user.store";

/**
 * Hook centralisé pour gérer l'authentification et la vérification de l'utilisateur
 */
export function useAuth() {
  const { address, isConnected } = useAccount();
  const { user, setUser, onboardingComplete, setOnboardingComplete } =
    useUserStore();
  const checkInProgress = useRef(false);

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      // Éviter les vérifications multiples
      if (checkInProgress.current || (user && user.address === address)) {
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

      checkInProgress.current = true;

      try {
        const fetchedUser = await getUserByAddress(address);
        if (mounted) {
          setUser({ ...fetchedUser, address });
          setOnboardingComplete(true);
        }
      } catch {
        if (mounted) {
          setUser(undefined);
          setOnboardingComplete(false);
        }
      } finally {
        checkInProgress.current = false;
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
