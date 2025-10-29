import React, { useEffect, useState } from "react";
import Card from "../components/UI/Card";
import { createUser } from "../api/users";
import ConnectButtonCustom from "../components/UI/ConnectButtonCustom";
import { CreateUserRequest } from "../types";
import { COLORS, COMMON_CLASSES } from "../constants/colors";
import { useAccount } from "wagmi";
import { useUserStore } from "../store/user.store";

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
    onboardingComplete,
    setOnboardingComplete,
    onboardingStep,
    setOnboardingStep,
  } = useUserStore();
  const { isConnected } = useAccount();

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

  // Handle input changes for form fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission: send user info to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Get wallet address from localStorage (set by RainbowKit or your logic)
      const walletAddress = localStorage.getItem("userAddress");
      if (!walletAddress) {
        setError("Wallet address not found. Please reconnect your wallet.");
        setLoading(false);
        return;
      }
      const userCreated = await createUser({
        username: userInfo.username,
        email: userInfo.email,
        address: walletAddress,
        role: userInfo.role,
      });
      setUser(userCreated);
      setOnboardingComplete(true);
      setOnboardingStep(3);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "Failed to create user.");
      setLoading(false);
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
    </div>
  );

  const onboardingStepTwo = () => (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white text-center">
        Create your account
      </h2>
      <div className="flex flex-col gap-4">
        <label
          htmlFor="role"
          className={`${COLORS.form.label} block mb-1 font-medium`}
        >
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
        <label
          htmlFor="username"
          className={`${COLORS.form.label} block mb-1 font-medium`}
        >
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
        <label
          htmlFor="email"
          className={`${COLORS.form.label} block mb-1 font-medium`}
        >
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
        disabled={loading}
      >
        {loading ? "Submitting..." : "Continue"}
      </button>
    </form>
  );

  const onboardingStepThree = () => (
    <div className="mt-4 text-center">
      {user?.role === "Owner" ? (
        <p className="text-gray-700 dark:text-gray-200">
          On the left sidebar, you can now build your projects from the
          dashboard.
        </p>
      ) : (
        <p className="text-gray-700 dark:text-gray-200">
          On the left sidebar, you can now contribute to projects and their
          success.
        </p>
      )}
    </div>
  );

  return (
    <div className="flex items-center h-full justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center dark:text-gray-200">
          Welcome to RocketStarter 🚀
        </h1>
        <h2 className="text-center text-gray-600 dark:text-gray-400 mb-4">
          Your gateway to innovative projects
        </h2>
        {onboardingStep === 1 && !isConnected && onboardingStepOne()}
        {onboardingStep === 2 &&
          isConnected &&
          !onboardingComplete &&
          onboardingStepTwo()}
        {onboardingStep === 3 &&
          isConnected &&
          onboardingComplete &&
          onboardingStepThree()}
      </Card>
    </div>
  );
}

export default Onboarding;
