# No-Loss Auction Protocol

A decentralized no-loss auction system built on the Stellar blockchain using Soroban smart contracts. This protocol enables users to participate in auctions using SEP-41 tokens with automatic refund mechanisms for outbid participants.

## 🚀 Quick Links

| Resource | Link |
|----------|------|
| **Frontend (Vercel)** | [https://no-loss-auction.vercel.app](https://no-loss-auction.vercel.app) |
| **Smart Contract ID** | `CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF` |
| **Network** | Stellar Testnet |
| **Explorer** | [Stellar Expert](https://expert.stellar.org/) |

## ✨ Features

### Smart Contract

The Soroban smart contract implements a complete no-loss auction system:

| Feature | Description |
|---------|-------------|
| **Create Auction** | Users can create new auctions with configurable parameters (title, token, minimum bid, deadline) |
| **Place Bids** | Participants place bids using SEP-41 tokens with automatic refund of previous highest bids |
| **Highest Bidder Tracking** | Real-time tracking of current highest bidder and bid amount |
| **Automatic Refunds** | When outbid, previous highest bidder is automatically refunded to their wallet |
| **Auction Finalization** | After deadline, auction creator can finalize, transferring winning bid to winner |
| **Auction Cancellation** | Auctions can only be cancelled if no bids have been placed |
| **Bid History** | Complete bid history maintained for transparency and audit |
| **Manual Refund Claims** | Fallback mechanism for claiming refunds if automatic refunds fail |

### Frontend

The React frontend provides a complete user interface with retro-futuristic design:

| Feature | Description |
|---------|-------------|
| **Freighter Wallet Integration** | Connect, display, and manage Stellar wallet through Freighter browser extension |
| **Auction Discovery** | Browse all active and past auctions with real-time bid information |
| **Auction Creation** | Form-based interface to create new auctions with validation |
| **Bid Placement** | Submit bids with Freighter wallet signing and transaction confirmation |
| **Real-Time Updates** | Live updates of highest bids and auction status |
| **Refund Visibility** | Clear display of refund status for outbid participants with manual claim option |
| **Auction Management** | Finalize completed auctions or cancel auctions with no bids |
| **Retro Design** | Distinctive visual aesthetic with scanlines, chromatic aberration, and digital artifacts |

## 🏗️ Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Smart Contract | Rust + Soroban SDK | Blockchain logic and state management |
| Contract Compilation | WASM (wasm32v1-none) | Stellar-compatible bytecode |
| Frontend Framework | React 19 | User interface |
| Styling | Tailwind CSS 4 | Responsive design system |
| Wallet Integration | Freighter API | Stellar wallet connection and signing |
| Blockchain Network | Stellar Testnet | Development and testing environment |
| Token Standard | SEP-41 | Standardized token interface |
| Deployment | Vercel | Frontend hosting and deployment |

## 📋 Contract Functions

### `create_auction(creator, title, token, minimum_bid, deadline) -> u64`

Creates a new auction and returns the auction ID.

**Parameters:**
- `creator`: Address of the auction creator (requires authentication)
- `title`: String describing the auction
- `token`: Address of the SEP-41 token to be used
- `minimum_bid`: Minimum acceptable bid amount (i128)
- `deadline`: Unix timestamp when the auction ends (u64)

**Returns:** Auction ID (u64)

### `place_bid(bidder, auction_id, bid_amount)`

Places a bid on an active auction.

**Parameters:**
- `bidder`: Address placing the bid (requires authentication)
- `auction_id`: ID of the target auction
- `bid_amount`: Bid amount in token units (i128)

**Behavior:**
- Transfers bid amount from bidder to contract
- Automatically refunds previous highest bidder
- Updates highest bidder and bid amount
- Emits BidPlaced event

### `get_highest_bid(auction_id) -> (Option<Address>, i128)`

Returns the current highest bidder and bid amount.

### `finalize_auction(caller, auction_id)`

Finalizes an auction after the deadline has passed.

**Parameters:**
- `caller`: Address of the auction creator (requires authentication)
- `auction_id`: ID of the auction to finalize

**Behavior:**
- Transfers winning bid to the winner
- Marks auction as finalized
- Emits AuctionFinalized event

### `cancel_auction(caller, auction_id)`

Cancels an auction if no bids have been placed.

**Parameters:**
- `caller`: Address of the auction creator (requires authentication)
- `auction_id`: ID of the auction to cancel

**Constraints:**
- Can only be called if bid_count == 0
- Emits AuctionCancelled event

### `get_auction_count() -> u64`

Returns the total number of auctions created.

### `get_bid_history(auction_id) -> Vec<Bid>`

Returns complete bid history for an auction.

### `claim_refund(caller, auction_id)`

Manual refund claim for outbid participants.

**Parameters:**
- `caller`: Address of the participant (requires authentication)
- `auction_id`: ID of the auction

**Behavior:**
- Finds caller's last bid in history
- Transfers refund amount if found
- Emits RefundClaimed event

## 🎨 Design System

### Visual Aesthetic

The application features a retro-futuristic "system failure" aesthetic:

| Element | Style |
|---------|-------|
| **Background** | Deep black (#000000) with horizontal scanlines |
| **Typography** | Bold white sans-serif with monospace for codes |
| **Accent Colors** | Neon cyan (#00FFFF) and magenta (#FF00FF) |
| **Effects** | Chromatic aberration, digital noise, geometric brackets |
| **Interactions** | Glitch effects, scanline animations, digital artifacts |

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Black | #000000 | Background |
| Pure White | #FFFFFF | Primary text |
| Neon Cyan | #00FFFF | Chromatic aberration left, borders |
| Neon Magenta | #FF00FF | Chromatic aberration right |
| Dark Gray | #1A1A1A | Panels and containers |
| Error Red | #FF0000 | Error states and alerts |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Freighter browser extension installed
- Stellar Testnet account with lumens
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/no-loss-auction.git
cd no-loss-auction

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
VITE_CONTRACT_ID=CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
```

### Running Locally

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 💻 Using the Application

### Connecting Your Wallet

1. Install the [Freighter browser extension](https://www.freighter.app/)
2. Create or import a Stellar account
3. Switch to the Stellar Testnet network
4. Click "Connect Wallet" on the application
5. Approve the connection in Freighter

### Creating an Auction

1. Click "Create Auction" button
2. Fill in auction details:
   - **Title**: Descriptive name for the auction
   - **Token Address**: SEP-41 token contract address
   - **Minimum Bid**: Starting bid amount
   - **Deadline**: When the auction ends
3. Click "Create" and approve the transaction in Freighter
4. Wait for confirmation on the testnet

### Placing a Bid

1. Find an active auction in the list
2. Click on the auction to view details
3. Enter your bid amount (must be higher than current highest bid)
4. Click "Place Bid"
5. Review and approve the transaction in Freighter
6. Your bid is submitted and previous highest bidder is automatically refunded

### Finalizing an Auction

1. Navigate to an auction you created
2. Wait until the deadline has passed
3. Click "Finalize Auction"
4. Approve the transaction in Freighter
5. The winning bid is transferred to the winner

### Cancelling an Auction

1. Navigate to an auction you created
2. The "Cancel" button is only available if no bids have been placed
3. Click "Cancel Auction"
4. Approve the transaction in Freighter
5. The auction is marked as cancelled

### Claiming Refunds

1. If you were outbid, a "Claim Refund" button appears on the auction
2. Click "Claim Refund" to manually claim your bid amount
3. Approve the transaction in Freighter
4. Your refund is processed

## 📁 Project Structure

```
no-loss-auction/
├── client/                          # React frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── WalletPanel.tsx      # Freighter wallet integration
│   │   │   ├── AuctionList.tsx      # List all auctions
│   │   │   └── RetroLayout.tsx      # Retro-futuristic layout
│   │   ├── pages/
│   │   │   └── Home.tsx             # Main application page
│   │   ├── hooks/
│   │   │   └── useFreighter.ts      # Wallet connection hook
│   │   ├── lib/
│   │   │   └── stellarClient.ts     # Stellar SDK setup
│   │   ├── styles/
│   │   │   └── retro.css            # Retro-futuristic styles
│   │   └── App.tsx                  # Main app component
│   └── vite.config.ts               # Vite configuration
├── contract/                        # Soroban smart contract
│   ├── src/
│   │   └── lib.rs                   # Contract implementation
│   ├── Cargo.toml                   # Rust dependencies
│   └── target/
│       └── wasm32v1-none/
│           └── release/
│               └── no_loss_auction.wasm  # Compiled WASM
├── README.md                        # This file
└── package.json                     # Project dependencies
```

## 🔐 Security Considerations

| Aspect | Implementation |
|--------|-----------------|
| **Authorization** | All contract functions use Soroban's `require_auth()` mechanism |
| **Token Transfers** | All token operations use the SEP-41 standard interface |
| **Refund Safety** | Automatic refunds are atomic with bid placement |
| **Auction Integrity** | Only creators can finalize or cancel their auctions |
| **Bid Validation** | Bids must exceed minimum and current highest bid |

## 🧪 Testing

### Manual Testing Checklist

- [ ] Connect Freighter wallet
- [ ] Create a new auction
- [ ] Place a bid on an auction
- [ ] Verify automatic refund of previous bid
- [ ] View bid history
- [ ] Finalize an auction after deadline
- [ ] Cancel an auction with no bids
- [ ] Claim manual refund
- [ ] Verify all transactions appear on testnet explorer

### Contract Testing

```bash
cd contract
cargo test --target wasm32v1-none
```

## 🌐 Deployment

### Frontend Deployment (Vercel)

The frontend is deployed on Vercel and accessible at: **https://no-loss-auction.vercel.app**

To deploy your own version:

```bash
# Deploy to Vercel
vercel deploy

# Set production environment variables in Vercel dashboard
```

### Smart Contract Deployment (Stellar Testnet)

The contract has been deployed using the Stellar CLI:

```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/no_loss_auction.wasm \
  --network testnet \
  --source <your-account>
```

**Contract ID:** `CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF`

## 📚 Resources

| Resource | Link |
|----------|------|
| Stellar Documentation | [https://developers.stellar.org/](https://developers.stellar.org/) |
| Soroban Smart Contracts | [https://developers.stellar.org/docs/build/smart-contracts](https://developers.stellar.org/docs/build/smart-contracts) |
| SEP-41 Token Standard | [https://developers.stellar.org/docs/tokens/token-interface](https://developers.stellar.org/docs/tokens/token-interface) |
| Freighter Wallet | [https://www.freighter.app/](https://www.freighter.app/) |
| Stellar Testnet Friendbot | [https://friendbot.stellar.org/](https://friendbot.stellar.org/) |

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Support

For issues, questions, or feature requests, please open an issue on the repository.

---

**Last Updated:** May 29, 2026  
**Network:** Stellar Testnet  
**Status:** Active and Deployed  
**Version:** 1.0.0
