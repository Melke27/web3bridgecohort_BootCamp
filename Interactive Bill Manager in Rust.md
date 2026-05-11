# Interactive Bill Manager in Rust

This project is a fully functional interactive command-line bill and expense manager written in Rust. It implements all the requested user stories across three stages, using a `HashMap` to efficiently manage the bills.

## Features Implemented

### Stage 1: Add and View Bills
- **Add Bills**: Users can input a bill's name and the amount owed. The application validates the amount to ensure it is a valid number.
- **View Bills**: Users can view all existing bills.

### Stage 2: Remove Bills
- **Remove Bills**: Users can delete a bill by entering its name. The application uses a `HashMap` where the bill name is the key, making removal an $O(1)$ operation.

### Stage 3: Edit Bills and Go Back
- **Edit Bills**: Users can update the amount of an existing bill by entering its name and the new amount.
- **Go Back**: The application features an interactive menu loop. Users can exit the application by selecting the "Go Back (Exit)" option. If a user enters an empty string during input prompts, the operation is canceled, effectively allowing them to "go back" if they change their mind.

## Code Structure

The code is structured into several logical components:

- **`Bill` Struct**: Represents a single bill with a `name` (`String`) and an `amount` (`f64`).
- **`Bills` Struct**: Manages a collection of `Bill` objects using a `HashMap<String, Bill>`. This choice of data structure makes adding, removing, and updating bills highly efficient.
- **Input Handling**: The `get_input` and `get_bill_amount` functions handle user input robustly, ensuring that invalid inputs (like non-numeric amounts) are caught and the user is prompted again.
- **Menu Functions**: Each menu option (add, view, remove, update) is encapsulated in its own function (`add_bill_menu`, `view_bills_menu`, etc.), keeping the code modular and easy to maintain.
- **Main Loop**: The `main_menu` function runs an infinite loop, displaying the menu and routing the user's choice to the appropriate function until the user chooses to exit.

## How to Run

1. Ensure you have Rust and Cargo installed.
2. Navigate to the project directory.
3. Run the application using Cargo:

```bash
cargo run
```

## Example Usage

```text
== Bill Manager ==
1. Add Bill
2. View Bills
3. Remove Bill
4. Update Bill
5. Go Back (Exit)
Enter selection:
1
Bill name:
Electricity
Amount:
50.5
Bill added

== Bill Manager ==
1. Add Bill
2. View Bills
3. Remove Bill
4. Update Bill
5. Go Back (Exit)
Enter selection:
2
Bill { name: "Electricity", amount: 50.5 }
```
