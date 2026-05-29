import React, { useState, useEffect } from 'react';
import { WalletPanel } from '@/components/WalletPanel';
import { AuctionList } from '@/components/AuctionList';
import { Auction } from '@/lib/stellarClient';
import '../styles/retro.css';

export default function Home() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock auction data for demonstration
  useEffect(() => {
    // In production, this would fetch from the contract via RPC
    const mockAuctions: Auction[] = [
      {
        id: 1,
        title: 'Vintage Stellar Tokens',
        token: 'GBUQWP3BOUZX34ULNQG23RQ6F4YUSXHTQSXUSMIQSTBE2TQYLUES5CV7',
        minimumBid: 100,
        deadline: Math.floor(Date.now() / 1000) + 86400,
        highestBidder: 'GBZXN7PIRZGNMHGA7MUSC23TFSQ55TWREN3QQ6NNLX3I7DBDA47JSHBM',
        highestBid: 500,
        bidCount: 3,
        status: 'Active',
        creator: 'GCZST3XVCDTUJ76ZAV2HA72KYTZ4KXH5XVXARQ3FCKSOO4XYGSWBZ6Z7',
      },
      {
        id: 2,
        title: 'Soroban Contract Tokens',
        token: 'GBUQWP3BOUZX34ULNQG23RQ6F4YUSXHTQSXUSMIQSTBE2TQYLUES5CV7',
        minimumBid: 50,
        deadline: Math.floor(Date.now() / 1000) - 3600,
        highestBidder: 'GDZST3XVCDTUJ76ZAV2HA72KYTZ4KXH5XVXARQ3FCKSOO4XYGSWBZ6Z7',
        highestBid: 200,
        bidCount: 5,
        status: 'Finalized',
        creator: 'GCZST3XVCDTUJ76ZAV2HA72KYTZ4KXH5XVXARQ3FCKSOO4XYGSWBZ6Z7',
      },
    ];

    setAuctions(mockAuctions);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 border-b-2 border-cyan-400 pb-6">
        <h1 className="text-4xl md:text-5xl font-black text-cyan-400 mb-2">
          <span className="bracket-left"></span>
          NO-LOSS AUCTION
          <span className="bracket-right"></span>
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          Decentralized Auction Protocol on Stellar Soroban
        </p>
        <div className="mt-4 flex gap-2 text-xs font-mono">
          <div className="flex items-center gap-1">
            <span className="status-indicator status-active"></span>
            <span>TESTNET ACTIVE</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="status-indicator status-active"></span>
            <span>CONTRACT DEPLOYED</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Wallet & Controls */}
        <div className="lg:col-span-1">
          <WalletPanel />

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="retro-button w-full"
            >
              CREATE AUCTION
            </button>
            <button
              onClick={() => setSelectedAuction(null)}
              className="retro-button w-full"
            >
              VIEW ALL AUCTIONS
            </button>
          </div>

          {/* Create Auction Form */}
          {showCreateForm && (
            <div className="retro-panel p-4 mt-4 digital-noise">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">
                <span className="bracket-left"></span>NEW AUCTION<span className="bracket-right"></span>
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Auction Title"
                  className="retro-input w-full"
                />
                <input
                  type="text"
                  placeholder="Token Address"
                  className="retro-input w-full"
                />
                <input
                  type="number"
                  placeholder="Minimum Bid"
                  className="retro-input w-full"
                />
                <input
                  type="datetime-local"
                  className="retro-input w-full"
                />
                <button className="retro-button w-full">SUBMIT</button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Auction Details */}
        <div className="lg:col-span-2">
          {selectedAuction ? (
            <div className="retro-panel p-6 digital-noise">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-cyan-400 mb-2">
                  {selectedAuction.title}
                </h2>
                <p className="text-gray-400 font-mono text-sm">
                  Auction #{selectedAuction.id}
                </p>
              </div>

              {/* Auction Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-black border-2 border-cyan-400">
                <div>
                  <p className="text-xs text-cyan-400 font-mono mb-1">STATUS:</p>
                  <p className="font-bold">{selectedAuction.status}</p>
                </div>
                <div>
                  <p className="text-xs text-cyan-400 font-mono mb-1">HIGHEST BID:</p>
                  <p className="font-bold text-cyan-400">{selectedAuction.highestBid}</p>
                </div>
                <div>
                  <p className="text-xs text-cyan-400 font-mono mb-1">MINIMUM BID:</p>
                  <p className="font-bold">{selectedAuction.minimumBid}</p>
                </div>
                <div>
                  <p className="text-xs text-cyan-400 font-mono mb-1">TOTAL BIDS:</p>
                  <p className="font-bold">{selectedAuction.bidCount}</p>
                </div>
              </div>

              {/* Bid Section */}
              {selectedAuction.status === 'Active' && (
                <div className="bg-black border-2 border-magenta-400 p-4 mb-6">
                  <h3 className="text-lg font-bold text-magenta-400 mb-4">PLACE BID</h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder={`Minimum: ${selectedAuction.highestBid + 1}`}
                      className="retro-input w-full"
                    />
                    <button className="retro-button w-full">SUBMIT BID</button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button className="retro-button">FINALIZE</button>
                <button className="retro-button danger">CANCEL</button>
                <button className="retro-button col-span-2">CLAIM REFUND</button>
              </div>

              {/* Bid History */}
              <div className="mt-6 pt-6 border-t-2 border-cyan-400">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">BID HISTORY</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <div className="p-2 bg-black border border-cyan-400 text-xs font-mono">
                    <div className="flex justify-between">
                      <span>GBZX...SHBM</span>
                      <span className="text-cyan-400">500 tokens</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <AuctionList
              auctions={auctions}
              loading={loading}
              onSelectAuction={setSelectedAuction}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t-2 border-cyan-400 text-center text-xs font-mono text-gray-500">
        <p>No-Loss Auction Protocol v1.0 | Stellar Testnet | Soroban Smart Contracts</p>
        <p className="mt-2">
          <span className="error-code">[SYSTEM ONLINE]</span>
        </p>
      </footer>
    </div>
  );
}
