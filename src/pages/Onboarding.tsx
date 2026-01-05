import React, { useEffect, useState } from "react";
import Card from "../components/UI/Card";
import { createUser } from "../api/users";
import ConnectButtonCustom from "../components/UI/ConnectButtonCustom";
import { CreateUserRequest } from "../types";
import { COLORS, COMMON_CLASSES } from "../constants/colors";
import { useAccount } from "wagmi";
import { useUserStore } from "../store/user.store";
import { useAuth } from "../hooks/useAuth";

function Onboarding() {
  const [userInfo, setUserInfo] = useState<CreateUserRequest>({
    address: "",
    role: "Owner",
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    user,
    setUser,
    isAuthenticated,
    onboardingComplete,
    setOnboardingComplete,
    onboardingStep,
    setOnboardingStep,
  } = useUserStore();
  const { address, isConnected } = useAccount();
  const { authLoading, authError } = useAuth();

  useEffect(() => {
    if (isConnected && onboardingStep === 1) {
      setOnboardingStep(2);
    }
    if (!isConnected) {
      setOnboardingStep(1);
    }
    if (onboardingComplete) {
      setOnboardingStep(3);
    }
  }, [isConnected, onboardingStep, setOnboardingStep, onboardingComplete]);

  const handleWalletConnect = () => {
    if (isConnected) {
      setOnboardingStep(2);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!address) {
        setError("Wallet address not found. Please reconnect your wallet.");
        setLoading(false);
        return;
      }

      if (!isAuthenticated) {
        setError("You must complete authentication before creating your profile.");
        setLoading(false);
        return;
      }

      const userCreated = await createUser({
        username: userInfo.username,
        email: userInfo.email,
        address: address,
        role: userInfo.role,
      });
      
      setUser(userCreated);
      setOnboardingComplete(true);
      setOnboardingStep(3);
    } catch (err: any) {
      setError(err?.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  const onboardingStepOne = () => (
    <div className="flex flex-col items-center gap-4">
      <p className="mb-2 text-gray-700 dark:text-gray-200">
        Connect your wallet to get started
      </p>
      <div onClick={handleWalletConnect}>
        <ConnectButtonCustom />
      </div>
      {authLoading && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          Authenticating...
        </p>
      )}
      {authError && (
        <div className={`${COLORS.form.error} text-sm text-center`}>
          {authError}
        </div>
      )}
    </div>
  );

  const onboardingStepTwo = () => (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white text-center">
        Create your account
      </h2>
      {authLoading && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          Completing authentication...
        </div>
      )}
      {!isAuthenticated && !authLoading && (
        <div className="text-center text-sm text-amber-600 dark:text-amber-400">
          Please sign the message in your wallet to continue
        </div>
      )}
      <div className="flex flex-col gap-4">
        <label htmlFor="role" className={`${COLORS.form.label} block mb-1 font-medium`}>
          Role
        </label>
        <select
          id="role"
          name="role"
          value={userInfo.role}
          onChange={handleChange}
          className={`${COMMON_CLASSES.input} w-full`}
        >
          <option value="Owner">Owner</option>
          <option value="Builder">Builder</option>
        </select>
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="username" className={`${COLORS.form.label} block mb-1 font-medium`}>
          Username
        </label>
        <input
          id="username"
          type="text"
          name="username"
          value={userInfo.username}
          onChange={handleChange}
          required
          className={`${COMMON_CLASSES.input} w-full`}
          placeholder="Your username"
        />
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="email" className={`${COLORS.form.label} block mb-1 font-medium`}>
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          required
          className={`${COMMON_CLASSES.input} w-full`}
          placeholder="your@email.com"
        />
      </div>
      {error && (
        <div className={`${COLORS.form.error} text-sm text-center`}>
          {error}
        </div>
      )}
      <button
        type="submit"
        className={`${COMMON_CLASSES.button.primary} w-full font-semibold mt-2`}
        disabled={loading || authLoading || !isAuthenticated}
      >
        {loading ? "Creating account..." : authLoading ? "Authenticating..." : "Continue"}
      </button>
    </form>
  );

  const onboardingStepThree = () => (
    <div className="mt-4 text-center">
      {user?.role === "Owner" ? (
        <p className="text-gray-700 dark:text-gray-200">
          On the left sidebar, you can now build your projects from the dashboard.
        </p>
      ) : (
        <p className="text-gray-700 dark:text-gray-200">
          On the left sidebar, you can now contribute to projects and their success.
        </p>
      )}
    </div>
  );

  return (
    <div className="flex items-center h-full justify-center bg-gray-50 dark:bg-gray-900 m-4 md:m-0">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center dark:text-gray-200">
          Welcome to RocketStarter 🚀
        </h1>
        <h2 className="text-center text-gray-600 dark:text-gray-400 mb-4">
          Your gateway to innovative projects
        </h2>
        {onboardingStep === 1 && !isConnected && onboardingStepOne()}
        {onboardingStep === 2 && isConnected && !onboardingComplete && onboardingStepTwo()}
        {onboardingStep === 3 && isConnected && onboardingComplete && onboardingStepThree()}
      </Card>
    </div>
  );
}

export default Onboarding;
