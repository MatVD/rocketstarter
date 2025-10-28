import React, { useState } from "react";
import Card from "../components/UI/Card";
import { createUser } from "../api/users";
import ConnectButtonCustom from "../components/UI/ConnectButtonCustom";
import { CreateUserRequest } from "../types";

function Onboarding() {
  const [step, setStep] = useState<1 | 2>(1);
  const [userInfo, setUserInfo] = useState<CreateUserRequest>({
    address: "",
    role: "Owner",
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Simulate wallet connection detection (RainbowKit handles real state)
  // (walletConnected is not used, but kept for possible future logic)
  // const [walletConnected, setWalletConnected] = useState(false);

  // RainbowKit exposes connection state, here we simulate for the example
  const handleWalletConnect = () => {
    // setWalletConnected(true);
    setStep(2);
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
      await createUser({
        username: userInfo.username,
        email: userInfo.email,
        address: walletAddress,
        role: userInfo.role,
      });
      setSuccess(true);
      // TODO: Redirect to dashboard or another page
    } catch (err: any) {
      setError(err?.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center h-full justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center dark:text-gray-200">
          Welcome to RocketStarter 🚀
        </h1>
        {step === 1 && (
          <div className="flex flex-col items-center gap-4">
            <p className="mb-2 text-gray-700 dark:text-gray-200">
              Connect your wallet to get started
            </p>
            <div onClick={handleWalletConnect}>
              <ConnectButtonCustom />
            </div>
          </div>
        )}
        {step === 2 && !success && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Role</span>
              <select
                name="role"
                value={userInfo.role}
                onChange={handleChange}
                className="rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="Owner">Owner</option>
                <option value="Builder">Builder</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Username</span>
              <input
                type="text"
                name="username"
                value={userInfo.username}
                onChange={handleChange}
                required
                className="rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                placeholder="Your username"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Email</span>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
                required
                className="rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                placeholder="your@email.com"
              />
            </label>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Continue"}
            </button>
          </form>
        )}
        {success && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-green-600 font-semibold">
              Account created successfully!
            </p>
            {/* TODO: Add redirect or navigation button */}
          </div>
        )}
      </Card>
    </div>
  );
}

export default Onboarding;
