import React, { useState, useEffect } from 'react';
import { Auction } from '@/lib/stellarClient';
import '../styles/retro.css';

interface AuctionListProps {
  auctions: Auction[];
  loading: boolean;
  onSelectAuction: (auction: Auction) => void;
}

export function AuctionList({ auctions, loading, onSelectAuction }: AuctionListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'finalized'>('all');

  const filteredAuctions = auctions.filter((auction) => {
    if (filter === 'active') return auction.status === 'Active';
    if (filter === 'finalized') return auction.status !== 'Active';
    return true;
  });

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const getTimeRemaining = (deadline: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = deadline - now;
    
    if (remaining <= 0) return 'ENDED';
    
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-cyan-400';
      case 'Finalized':
        return 'text-green-400';
      case 'Cancelled':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="retro-panel p-6 digital-noise">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">
          <span className="bracket-left"></span>
          AUCTION REGISTRY
          <span className="bracket-right"></span>
        </h2>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          {(['all', 'active', 'finalized'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 font-mono text-sm ${
                filter === f
                  ? 'bg-cyan-400 text-black border-2 border-cyan-400'
                  : 'bg-black text-cyan-400 border-2 border-cyan-400'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-cyan-400 font-mono animate-pulse">LOADING AUCTIONS...</p>
        </div>
      ) : filteredAuctions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 font-mono">NO AUCTIONS FOUND</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAuctions.map((auction) => (
            <button
              key={auction.id}
              onClick={() => onSelectAuction(auction)}
              className="w-full text-left p-4 bg-black border-2 border-cyan-400 hover:bg-cyan-400 hover:text-black transition cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{auction.title}</h3>
                  <p className="text-xs font-mono text-gray-400">ID: #{auction.id}</p>
                </div>
                <span className={`font-mono text-sm font-bold ${getStatusColor(auction.status)}`}>
                  {auction.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                <div>
                  <p className="text-xs text-gray-400">HIGHEST BID:</p>
                  <p className="text-cyan-400">{auction.highestBid} tokens</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">BIDS:</p>
                  <p className="text-cyan-400">{auction.bidCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">MIN BID:</p>
                  <p className="text-cyan-400">{auction.minimumBid} tokens</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">TIME REMAINING:</p>
                  <p className="text-cyan-400">{getTimeRemaining(auction.deadline)}</p>
                </div>
              </div>

              {auction.highestBidder && (
                <div className="mt-2 pt-2 border-t border-cyan-400 text-xs">
                  <p className="text-gray-400">LEADER:</p>
                  <p className="font-mono text-cyan-400">
                    {auction.highestBidder.slice(0, 6)}...{auction.highestBidder.slice(-6)}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t-2 border-cyan-400 text-xs font-mono">
        <p className="text-cyan-400 mb-2">LEGEND:</p>
        <div className="grid grid-cols-3 gap-2 text-gray-400">
          <div><span className="text-cyan-400">●</span> Active</div>
          <div><span className="text-green-400">●</span> Finalized</div>
          <div><span className="text-red-400">●</span> Cancelled</div>
        </div>
      </div>
    </div>
  );
}
