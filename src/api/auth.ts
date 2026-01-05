import api from "./client";

/**
 * Authentication API endpoints for Web3 JWT flow
 */

// Challenge response type
export interface ChallengeResponse {
  message: string;
  nonce: string;
}

// Verify response type
export interface VerifyResponse {
  accessToken: string;
}

/**
 * Request a challenge (message + nonce) to sign with wallet
 * @param address - Ethereum wallet address (0x...)
 * @returns Challenge message and nonce
 */
export const requestChallenge = async (
  address: string
): Promise<ChallengeResponse> => {
  const response = await api.post("/auth/challenge", { address });
  return response.data;
};

/**
 * Verify the signed message and get JWT access token
 * The JWT will be automatically set as an httpOnly cookie by the backend
 * @param address - Ethereum wallet address (0x...)
 * @param signature - Signed message (0x...)
 * @returns Verification response
 */
export const verifySignature = async (
  address: string,
  signature: string
): Promise<VerifyResponse> => {
  const response = await api.post("/auth/verify", { address, signature });
  return response.data;
};

/**
 * Logout and clear the httpOnly cookie
 * The backend will invalidate the JWT cookie
 */
export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
