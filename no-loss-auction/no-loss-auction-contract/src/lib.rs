#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, Symbol, Vec, String,
    token,
};

// ============================================================================
// Data Types and Structures
// ============================================================================

#[derive(Clone, Copy, PartialEq, Eq)]
#[contracttype]
pub enum AuctionStatus {
    Active = 0,
    Finalized = 1,
    Cancelled = 2,
}

#[derive(Clone)]
#[contracttype]
pub struct Auction {
    pub id: u64,
    pub title: String,
    pub token: Address,
    pub minimum_bid: i128,
    pub deadline: u64,
    pub highest_bidder: Option<Address>,
    pub highest_bid: i128,
    pub bid_count: u32,
    pub status: AuctionStatus,
    pub creator: Address,
}

#[derive(Clone)]
#[contracttype]
pub struct Bid {
    pub bidder: Address,
    pub amount: i128,
    pub timestamp: u64,
}

// ============================================================================
// Helper Functions
// ============================================================================

fn auction_key(env: &Env, auction_id: u64) -> Symbol {
    let id_str = if auction_id < 10 {
        Symbol::new(env, "a0")
    } else if auction_id < 100 {
        Symbol::new(env, "a00")
    } else if auction_id < 1000 {
        Symbol::new(env, "a000")
    } else {
        Symbol::new(env, "a0000")
    };
    id_str
}

// ============================================================================
// Contract Implementation
// ============================================================================

#[contract]
pub struct NoLossAuctionContract;

#[contractimpl]
impl NoLossAuctionContract {
    /// Initialize the contract
    pub fn init(env: Env) {
        let storage = env.storage().persistent();
        let init_key = Symbol::new(&env, "init");
        if !storage.has(&init_key) {
            storage.set(&init_key, &true);
            storage.set(&Symbol::new(&env, "count"), &0u64);
        }
    }

    /// Create a new auction
    pub fn create_auction(
        env: Env,
        creator: Address,
        title: String,
        token: Address,
        minimum_bid: i128,
        deadline: u64,
    ) -> u64 {
        creator.require_auth();
        
        let storage = env.storage().persistent();

        // Validate inputs
        if minimum_bid <= 0 {
            panic!("Minimum bid must be positive");
        }
        if deadline <= env.ledger().timestamp() {
            panic!("Deadline must be in the future");
        }

        // Get next auction ID
        let count_key = Symbol::new(&env, "count");
        let auction_count: u64 = storage.get(&count_key).unwrap_or(0);
        let auction_id = auction_count + 1;

        // Create auction
        let auction = Auction {
            id: auction_id,
            title,
            token,
            minimum_bid,
            deadline,
            highest_bidder: None,
            highest_bid: 0,
            bid_count: 0,
            status: AuctionStatus::Active,
            creator: creator.clone(),
        };

        // Store auction using auction_id as part of the key
        let auction_key = (Symbol::new(&env, "auction"), auction_id);
        storage.set(&auction_key, &auction);
        storage.set(&count_key, &auction_id);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "AuctionCreated"),),
            (auction_id, creator),
        );

        auction_id
    }

    /// Get auction details
    pub fn get_auction(env: Env, auction_id: u64) -> Auction {
        let storage = env.storage().persistent();
        let auction_key = (Symbol::new(&env, "auction"), auction_id);
        
        storage
            .get(&auction_key)
            .expect("Auction not found")
    }

    /// Place a bid on an auction
    pub fn place_bid(env: Env, bidder: Address, auction_id: u64, bid_amount: i128) {
        bidder.require_auth();
        
        let storage = env.storage().persistent();
        let auction = Self::get_auction(env.clone(), auction_id);
        let token_client = token::Client::new(&env, &auction.token);

        // Get auction
        let auction_key = (Symbol::new(&env, "auction"), auction_id);
        let mut auction: Auction = storage.get(&auction_key).expect("Auction not found");

        // Validate auction status
        if auction.status != AuctionStatus::Active {
            panic!("Auction is not active");
        }

        // Check deadline
        if env.ledger().timestamp() >= auction.deadline {
            panic!("Auction deadline has passed");
        }

        // Validate bid amount
        if bid_amount < auction.minimum_bid {
            panic!("Bid amount is below minimum");
        }

        if bid_amount <= auction.highest_bid {
            panic!("Bid must be higher than current highest bid");
        }

        // Transfer tokens from bidder to contract
        token_client.transfer(
            &bidder,
            &env.current_contract_address(),
            &bid_amount,
        );

        // Refund previous highest bidder if exists
        if let Some(prev_bidder) = &auction.highest_bidder {
            token_client.transfer(
                &env.current_contract_address(),
                prev_bidder,
                &auction.highest_bid,
            );
        }

        // Update auction
        auction.highest_bidder = Some(bidder.clone());
        auction.highest_bid = bid_amount;
        auction.bid_count += 1;

        // Store updated auction
        storage.set(&auction_key, &auction);

        // Store bid history
        let bid_history_key = (Symbol::new(&env, "bids"), auction_id);
        let mut bids: Vec<Bid> = storage.get(&bid_history_key).unwrap_or_else(|| Vec::new(&env));
        
        bids.push_back(Bid {
            bidder: bidder.clone(),
            amount: bid_amount,
            timestamp: env.ledger().timestamp(),
        });
        
        storage.set(&bid_history_key, &bids);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "BidPlaced"),),
            (auction_id, bidder, bid_amount),
        );
    }

    /// Get the current highest bid for an auction
    pub fn get_highest_bid(env: Env, auction_id: u64) -> (Option<Address>, i128) {
        let auction = Self::get_auction(env, auction_id);
        (auction.highest_bidder, auction.highest_bid)
    }

    /// Finalize an auction (transfer tokens to winner)
    pub fn finalize_auction(env: Env, caller: Address, auction_id: u64) {
        caller.require_auth();
        
        let storage = env.storage().persistent();

        // Get auction
        let auction_key = (Symbol::new(&env, "auction"), auction_id);
        let mut auction: Auction = storage.get(&auction_key).expect("Auction not found");

        // Only creator can finalize
        if caller != auction.creator {
            panic!("Only auction creator can finalize");
        }

        // Check if auction has ended
        if env.ledger().timestamp() < auction.deadline {
            panic!("Auction has not ended yet");
        }

        // Check if already finalized
        if auction.status != AuctionStatus::Active {
            panic!("Auction is already finalized or cancelled");
        }

        // If there's a winner, transfer tokens to them
        if let Some(winner) = &auction.highest_bidder {
            let token_client = token::Client::new(&env, &auction.token);
            token_client.transfer(
                &env.current_contract_address(),
                winner,
                &auction.highest_bid,
            );
        }

        // Update auction status
        auction.status = AuctionStatus::Finalized;
        storage.set(&auction_key, &auction);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "AuctionFinalized"),),
            (auction_id, auction.highest_bidder),
        );
    }

    /// Cancel an auction (only if no bids exist)
    pub fn cancel_auction(env: Env, caller: Address, auction_id: u64) {
        caller.require_auth();
        
        let storage = env.storage().persistent();

        // Get auction
        let auction_key = (Symbol::new(&env, "auction"), auction_id);
        let mut auction: Auction = storage.get(&auction_key).expect("Auction not found");

        // Only creator can cancel
        if caller != auction.creator {
            panic!("Only auction creator can cancel");
        }

        // Can only cancel if no bids
        if auction.bid_count > 0 {
            panic!("Cannot cancel auction with existing bids");
        }

        // Update status
        auction.status = AuctionStatus::Cancelled;
        storage.set(&auction_key, &auction);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "AuctionCancelled"),),
            (auction_id,),
        );
    }

    /// Get auction count
    pub fn get_auction_count(env: Env) -> u64 {
        let storage = env.storage().persistent();
        storage.get(&Symbol::new(&env, "count")).unwrap_or(0)
    }

    /// Get bid history for an auction
    pub fn get_bid_history(env: Env, auction_id: u64) -> Vec<Bid> {
        let storage = env.storage().persistent();
        let bid_history_key = (Symbol::new(&env, "bids"), auction_id);
        storage.get(&bid_history_key).unwrap_or_else(|| Vec::new(&env))
    }

    /// Manual refund for failed automatic refunds (if needed)
    pub fn claim_refund(env: Env, caller: Address, auction_id: u64) {
        caller.require_auth();
        
        let auction = Self::get_auction(env.clone(), auction_id);
        let token_client = token::Client::new(&env, &auction.token);

        // Check if caller was outbid (not current highest bidder)
        if let Some(highest) = &auction.highest_bidder {
            if caller == *highest {
                panic!("You are the current highest bidder");
            }
        }

        // Get bid history to find caller's last bid
        let storage = env.storage().persistent();
        let bid_history_key = (Symbol::new(&env, "bids"), auction_id);
        let bids: Vec<Bid> = storage.get(&bid_history_key).unwrap_or_else(|| Vec::new(&env));

        let mut refund_amount = 0i128;
        for bid in bids.iter() {
            if bid.bidder == caller {
                refund_amount = bid.amount;
            }
        }

        if refund_amount > 0 {
            token_client.transfer(
                &env.current_contract_address(),
                &caller,
                &refund_amount,
            );

            env.events().publish(
                (Symbol::new(&env, "RefundClaimed"),),
                (auction_id, caller, refund_amount),
            );
        }
    }
}
