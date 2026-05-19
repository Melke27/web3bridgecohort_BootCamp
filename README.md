# Web3Bridge Cohort - Rust Projects

A collection of Rust projects developed as part of the Web3Bridge bootcamp curriculum, showcasing fundamental Rust programming concepts and practices.

## 📁 Project Structure

```
.
├── Interactive Bill Manager in Rust.md    # Detailed documentation
├── main.rs                                 # Bill Manager application
├── crowdfunding/                           # Crowdfunding library project
│   ├── Cargo.toml                         # Project manifest
│   └── src/
│       └── lib.rs                         # Library implementation
└── README.md                               # This file
```

## 🎯 Projects

### 1. Interactive Bill Manager
A practical command-line bill management system that demonstrates Rust fundamentals including collections, I/O handling, and control flow.

**Features:**
- ✅ Add bills with name and amount
- ✅ View all stored bills
- ✅ Remove bills by name
- ✅ Update bill amounts
- ✅ Interactive text-based menu interface
- ✅ In-memory storage using HashMap

**Technology Stack:**
- Language: Rust
- Collections: HashMap
- I/O: Standard Input/Output

**Quick Start:**
```bash
# Build the project
cargo build --release

# Run the application
cargo run
# or
./target/release/main
```

**Interactive Menu:**
```
== Bill Manager ==
1. Add Bill
2. View Bills
3. Remove Bill
4. Update Bill
5. Go Back (Exit)
Enter selection:
```

### 2. Crowdfunding Library
A modular Rust library for crowdfunding functionality, built with modern Rust practices.

**Location:** `crowdfunding/`

**Quick Start:**
```bash
cd crowdfunding
cargo build
cargo test
```

## 🚀 Getting Started

### Prerequisites
- Rust (install from https://rustup.rs/)
- Cargo (comes with Rust)

### Installation

```bash
# Clone the repository
git clone https://github.com/Melke27/web3bridgecohort_BootCamp.git
cd web3bridgecohort_BootCamp

# Build all projects
cargo build --release
```

### Running the Projects

**Bill Manager:**
```bash
cargo run
```

**Crowdfunding Library:**
```bash
cd crowdfunding
cargo test
```

## 📚 Project Details

### Bill Manager Implementation

The Bill Manager uses a `HashMap<String, Bill>` to store and manage bills efficiently. Key operations:

- **Add**: Insert a new bill with O(1) average complexity
- **View**: Retrieve all bills
- **Remove**: Delete a bill by name
- **Update**: Modify bill amounts

### Code Structure
```
Bills struct
├── inner: HashMap<String, Bill>
├── new() → Self
├── add(bill: Bill)
├── get_all() → Vec<&Bill>
├── remove(name: &str) → bool
└── update(name: &str, amount: f64) → bool
```

## 🛠 Building and Testing

```bash
# Build in release mode
cargo build --release

# Run tests
cargo test

# Run with verbose output
cargo run -- --verbose

# Build documentation
cargo doc --open
```

## 📖 Documentation

- [Interactive Bill Manager Documentation](./Interactive%20Bill%20Manager%20in%20Rust.md) - Detailed walkthrough
- `cargo doc --open` - Generate and view Rust documentation

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Rust ownership and borrowing
- ✅ Collections (HashMap, Vec)
- ✅ Pattern matching and error handling
- ✅ Structs and implementations
- ✅ I/O operations
- ✅ Module organization
- ✅ Cargo workspace management

## 📝 License

This project is part of the Web3Bridge bootcamp curriculum.

## 👤 Author

Melkamu - Web3Bridge Cohort Participant

## 🔗 Links

- GitHub Repository: https://github.com/Melke27/web3bridgecohort_BootCamp
- Rust Documentation: https://doc.rust-lang.org/
- Cargo Guide: https://doc.rust-lang.org/cargo/

---

**Last Updated:** May 2026 | **Rust Edition:** 2021+