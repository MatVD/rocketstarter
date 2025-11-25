import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BackendProvider } from "./contexts/BackendContext";
import { ToastProvider } from "./contexts/ToastContext";

// wagmi / viem / rainbowkit
import {
  RainbowKitProvider,
  darkTheme as rainbowDarkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, sepolia } from "wagmi/chains";

// Use RainbowKit helper to build a wagmi config compatible with the installed versions.
// projectId is required for WalletConnect v2; for local dev you can provide your own.
const wagmiConfig = getDefaultConfig({
  appName: "Rocket Launch",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [mainnet, sepolia],
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider theme={rainbowDarkTheme()}>
        <ThemeProvider>
          <BackendProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </BackendProvider>
        </ThemeProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
