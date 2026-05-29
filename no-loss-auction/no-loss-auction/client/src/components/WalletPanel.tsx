import React, { useState } from 'react';
import { useFreighter } from '@/hooks/useFreighter';
import '../styles/retro.css';

export function WalletPanel() {
  const { wallet, loading, error, connect, disconnect, isConnected, publicKey } = useFreighter();
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  return (
    <div className="retro-panel p-6 mb-6 digital-noise">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-cyan-400">
          <span className="bracket-left"></span>
          WALLET STATUS
          <span className="bracket-right"></span>
        </h2>
        <div className="flex items-center gap-2">
          <div className={`status-indicator ${isConnected ? 'status-active' : 'status-inactive'}`}></div>
          <span className="text-sm font-mono">
            {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900 border-2 border-red-500 rounded">
          <p className="error-code">ERROR: {error}</p>
        </div>
      )}

      {isConnected && publicKey ? (
        <div className="space-y-4">
          <div className="bg-black border-2 border-cyan-400 p-4 rounded">
            <p className="text-xs text-cyan-400 mb-2 font-mono">PUBLIC KEY:</p>
            <div className="flex items-center justify-between">
              <code className="text-white font-mono text-sm break-all">
                {truncateAddress(publicKey)}
              </code>
              <button
                onClick={handleCopyAddress}
                className="ml-2 px-3 py-1 bg-cyan-400 text-black font-mono text-xs rounded hover:bg-magenta-400 transition"
              >
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>
          </div>

          <button
            onClick={disconnect}
            className="retro-button w-full"
          >
            DISCONNECT WALLET
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-cyan-400 font-mono text-sm">
            Connect your Freighter wallet to interact with auctions.
          </p>
          <button
            onClick={handleConnect}
            disabled={loading}
            className="retro-button w-full"
          >
            {loading ? 'CONNECTING...' : 'CONNECT WALLET'}
          </button>
          <p className="text-xs text-gray-500 font-mono">
            Ensure Freighter is installed and you're on the Stellar Testnet.
          </p>
        </div>
      )}

      {/* System Status Display */}
      <div className="mt-6 pt-4 border-t-2 border-cyan-400">
        <p className="text-xs text-cyan-400 font-mono mb-2">SYSTEM STATUS:</p>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="flex items-center">
            <span className="status-indicator status-active"></span>
            <span>FREIGHTER: OK</span>
          </div>
          <div className="flex items-center">
            <span className={`status-indicator ${isConnected ? 'status-active' : 'status-inactive'}`}></span>
            <span>AUTH: {isConnected ? 'OK' : 'PENDING'}</span>
          </div>
          <div className="flex items-center">
            <span className="status-indicator status-active"></span>
            <span>TESTNET: OK</span>
          </div>
          <div className="flex items-center">
            <span className="status-indicator status-active"></span>
            <span>CONTRACT: OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
