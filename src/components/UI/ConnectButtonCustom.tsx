import { ConnectButton } from '@rainbow-me/rainbowkit';

function ConnectButtonCustom() {
  return (
    <ConnectButton.Custom>
                    {({
                      account,
                      chain,
                      openAccountModal,
                      openChainModal,
                      openConnectModal,
                      mounted,
                    }) => {
                      const ready = mounted;
                      const connected = ready && account && chain;
    
                      return (
                        <div
                          {...(!ready && {
                            "aria-hidden": true,
                            style: {
                              opacity: 0,
                              pointerEvents: "none",
                              userSelect: "none",
                            },
                          })}
                        >
                          {(() => {
                            if (!connected) {
                              return (
                                <button
                                  onClick={openConnectModal}
                                  type="button"
                                  className="w-full bg-[#2463eb] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
                                >
                                  Connect Wallet
                                </button>
                              );
                            }
                            if (chain.unsupported) {
                              return (
                                <button
                                  onClick={openChainModal}
                                  type="button"
                                  className="w-full bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-colors"
                                >
                                  Wrong network
                                </button>
                              );
                            }
                            return (
                              <div className="space-y-2">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Connected: {account.displayName}
                                </div>
                                <button
                                  onClick={openAccountModal}
                                  type="button"
                                  className="w-full bg-[#2463eb] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
                                >
                                  Manage Account
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
  )
}

export default ConnectButtonCustom