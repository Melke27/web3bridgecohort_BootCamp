# No-Loss Auction Protocol - Deployment Guide

## Project Overview

This ZIP file contains a complete decentralized no-loss auction system built on Stellar using Soroban smart contracts.

### Contents

```
no-loss-auction/                    # React frontend with retro-futuristic design
├── client/                         # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── WalletPanel.tsx     # Freighter wallet integration
│   │   │   └── AuctionList.tsx     # Auction browser
│   │   ├── hooks/
│   │   │   └── useFreighter.ts     # Wallet connection hook
│   │   ├── lib/
│   │   │   └── stellarClient.ts    # Stellar SDK client
│   │   ├── styles/
│   │   │   └── retro.css           # Retro-futuristic styles
│   │   └── pages/
│   │       └── Home.tsx            # Main application page
│   └── package.json
├── server/                         # Express backend
├── README.md                       # Full documentation
└── todo.md                         # Feature tracking

no-loss-auction-contract/           # Soroban smart contract
├── src/
│   └── lib.rs                      # Contract implementation (Rust)
├── Cargo.toml                      # Rust dependencies
└── target/
    └── wasm32v1-none/
        └── release/
            └── no_loss_auction.wasm # Compiled WASM (9.0K)
```

## Quick Start

### 1. Extract the ZIP File

```bash
unzip no-loss-auction.zip
cd no-loss-auction
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
pnpm install

# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustup target add wasm32v1-none
```

### 3. Run Locally

```bash
# Start development server
pnpm dev

# Open http://localhost:3000 in your browser
```

## Smart Contract Deployment

### Prerequisites

- Stellar CLI installed: `cargo install stellar-cli`
- Stellar testnet account with lumens
- Get free testnet lumens: https://friendbot.stellar.org/

### Deploy to Stellar Testnet

```bash
cd no-loss-auction-contract

# Build the contract (already compiled in target/)
# The WASM file is at: target/wasm32v1-none/release/no_loss_auction.wasm

# Deploy using Stellar CLI
stellar contract deploy \
  --wasm target/wasm32v1-none/release/no_loss_auction.wasm \
  --network testnet \
  --source <your-stellar-account>
```

**Save the returned Contract ID** - you'll need this for the frontend.

### Example Output

```
Contract ID: CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF
```

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel deploy

# Set production environment variables in Vercel dashboard:
# VITE_CONTRACT_ID=<your-contract-id>
# VITE_STELLAR_NETWORK=testnet
# VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
```

### Option 2: Deploy to Netlify

```bash
# Build the project
pnpm build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: Deploy to GitHub Pages

```bash
# Build the project
pnpm build

# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/no-loss-auction.git
git push -u origin main

# Enable GitHub Pages in repository settings
# Set source to: dist/ folder
```

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_CONTRACT_ID=CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
```

### Update README

After deploying, update the README.md with:

1. **Frontend URL**: Your Vercel/Netlify/GitHub Pages URL
2. **Contract ID**: The ID returned from contract deployment

## Testing the Application

### 1. Install Freighter Wallet

- Download: https://www.freighter.app/
- Create a testnet account or import existing one
- Switch to Stellar Testnet

### 2. Get Testnet Lumens

```bash
curl "https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY"
```

### 3. Test Features

- [ ] Connect wallet
- [ ] Create an auction
- [ ] Place a bid
- [ ] View bid history
- [ ] Finalize auction (after deadline)
- [ ] Cancel auction (if no bids)
- [ ] Claim refund

## Contract Functions

### Core Functions

| Function | Parameters | Returns |
|----------|-----------|---------|
| `create_auction` | creator, title, token, minimum_bid, deadline | auction_id (u64) |
| `place_bid` | bidder, auction_id, bid_amount | - |
| `get_highest_bid` | auction_id | (Option<Address>, i128) |
| `finalize_auction` | caller, auction_id | - |
| `cancel_auction` | caller, auction_id | - |
| `claim_refund` | caller, auction_id | - |
| `get_auction_count` | - | u64 |
| `get_bid_history` | auction_id | Vec<Bid> |

## Troubleshooting

### Wallet Connection Issues

- Ensure Freighter is installed and enabled
- Switch to Stellar Testnet in Freighter settings
- Clear browser cache and reload

### Transaction Failures

- Check you have sufficient testnet lumens for fees
- Verify the contract ID is correct
- Ensure the token address is valid on testnet

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

## Project Structure

### Frontend Architecture

```
client/src/
├── pages/
│   └── Home.tsx              # Main application page
├── components/
│   ├── WalletPanel.tsx       # Wallet connection UI
│   ├── AuctionList.tsx       # Auction list display
│   └── ui/                   # shadcn/ui components
├── hooks/
│   └── useFreighter.ts       # Freighter wallet hook
├── lib/
│   └── stellarClient.ts      # Stellar SDK wrapper
├── styles/
│   └── retro.css             # Retro-futuristic styles
└── App.tsx                   # Main app component
```

### Smart Contract Architecture

```
contract/src/
└── lib.rs
    ├── AuctionStatus enum    # Active, Finalized, Cancelled
    ├── Auction struct        # Auction data
    ├── Bid struct            # Bid data
    └── NoLossAuctionContract
        ├── create_auction()
        ├── place_bid()
        ├── finalize_auction()
        ├── cancel_auction()
        ├── claim_refund()
        └── ...
```

## Design System

### Retro-Futuristic Aesthetic

- **Background**: Deep black (#000000) with horizontal scanlines
- **Text**: Bold white sans-serif with monospace for codes
- **Accents**: Neon cyan (#00FFFF) and magenta (#FF00FF)
- **Effects**: Chromatic aberration, digital noise, geometric brackets

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Black | #000000 | Background |
| White | #FFFFFF | Text |
| Cyan | #00FFFF | Borders, accents |
| Magenta | #FF00FF | Highlights |
| Dark Gray | #1A1A1A | Panels |
| Red | #FF0000 | Errors |

## Support & Resources

- **Stellar Docs**: https://developers.stellar.org/
- **Soroban Guide**: https://developers.stellar.org/docs/build/smart-contracts
- **Freighter Wallet**: https://www.freighter.app/
- **Testnet Faucet**: https://friendbot.stellar.org/

## License

MIT License

## Version

- **Version**: 1.0.0
- **Network**: Stellar Testnet
- **Status**: Ready for Deployment
- **Last Updated**: May 29, 2026
