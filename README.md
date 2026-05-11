# Interactive Bill Manager in Rust

A simple command-line bill management application written in Rust.

## Features

- Add bills with name and amount
- View all bills
- Remove bills by name
- Update bill amounts
- Simple text-based menu interface

## Usage

1. Clone the repository
2. Build with `cargo build --release`
3. Run with `./target/release/main` (or `cargo run`)

## How it works

The application uses a simple hash map to store bills, with the bill name as the key. 
All operations are performed through a text-based menu.

## Files

- `main.rs` - Contains the complete application
- `Interactive Bill Manager in Rust.md` - Documentation about the application

## Example

```
== Bill Manager ==
1. Add Bill
2. View Bills
3. Remove Bill
4. Update Bill
5. Go Back (Exit)
Enter selection:
```