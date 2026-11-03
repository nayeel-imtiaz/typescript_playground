/*
Bank Account Transfer System
Name: Nayeel Imtiaz
Date: 11-02-2026
 */

import * as assert from "node:assert/strict"

enum TransactionType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
    TRANSFER = "transfer",
}

class Transaction {
    constructor(public type: TransactionType,
                public amount: number,
                public sender_id: number,
                public recipient_id?: number
    ) {}
}

class Account {
    transactions: Transaction[] = [];

    constructor(public id: number, public name: string, public balance: number = 0) {}
}

class Bank {
    private accounts = new Map<number, Account>();
    private next_unique_id = 1;

    add_account(name: string) : number {
        let bank_id = this.next_unique_id;
        this.accounts.set(bank_id, new Account(bank_id, name));
        this.next_unique_id += 1;
        return bank_id;
    }

    check_balance(bank_id: number) : number | undefined {
        return this.accounts.get(bank_id)?.balance;
    }

    get_transaction_history(bank_id: number) : Transaction[] | undefined {
        return this.accounts.get(bank_id)?.transactions;
    }

    deposit(bank_id: number, amount: number) : boolean {
        if (
            amount <= 0
            || !this.accounts.has(bank_id)
        ) {
            return false;
        } else {
            this.accounts.get(bank_id)?.transactions.push(new Transaction(TransactionType.DEPOSIT, amount, bank_id));
            this.accounts.get(bank_id)!.balance += amount;
            return true;
        }
    }

    withdraw(bank_id: number, amount: number) : boolean {
        if (
            amount <= 0
            || !this.accounts.has(bank_id)
            || this.accounts.get(bank_id)!.balance < amount
        ) {
            return false;
        } else {
            this.accounts.get(bank_id)?.transactions.push(new Transaction(TransactionType.WITHDRAW, amount, bank_id));
            this.accounts.get(bank_id)!.balance -= amount;
            return true;
        }
    }

    transfer(sending_bank_id: number, receiving_bank_id: number, amount: number) : boolean {
        if (
            amount <= 0
            || !this.accounts.has(sending_bank_id)
            || !this.accounts.has(receiving_bank_id)
            || this.accounts.get(sending_bank_id)!.balance < amount
        ) {
            return false;
        } else {
            let new_transaction = new Transaction(TransactionType.TRANSFER, amount, sending_bank_id, receiving_bank_id);
            this.accounts.get(sending_bank_id)?.transactions.push(new_transaction);
            this.accounts.get(receiving_bank_id)?.transactions.push(new_transaction);
            this.accounts.get(sending_bank_id)!.balance -= amount;
            this.accounts.get(receiving_bank_id)!.balance += amount;
            return true;
        }
    }
}

function bank_transfer() : void {
    let bank = new Bank();
    let jane_account = bank.add_account("Jane Doe");
    assert.equal(jane_account, 1);
    assert.equal(bank.check_balance(jane_account), 0);
    assert.equal(bank.get_transaction_history(jane_account)?.length, 0);

    assert.equal(bank.check_balance(-42), undefined);
    assert.equal(bank.get_transaction_history(-42), undefined);

    assert.equal(bank.deposit(jane_account, 100), true);
    assert.equal(bank.check_balance(jane_account), 100);
    assert.equal(bank.get_transaction_history(jane_account)?.length, 1);

    assert.equal(bank.withdraw(jane_account, 50), true);
    assert.equal(bank.check_balance(jane_account), 50);
    assert.equal(bank.get_transaction_history(jane_account)?.length, 2);

    let adam_account = bank.add_account("Adam Smith");
    assert.equal(adam_account, 2);
    assert.equal(bank.check_balance(adam_account), 0);
    assert.equal(bank.get_transaction_history(adam_account)?.length, 0);

    bank.transfer(jane_account, adam_account, 50);
    assert.equal(bank.check_balance(jane_account), 0);
    assert.equal(bank.check_balance(adam_account), 50);
    assert.equal(bank.get_transaction_history(jane_account)?.length, 3);
    assert.equal(bank.get_transaction_history(adam_account)?.length, 1);

    console.log("All tests pass.");
    console.log("Jane's transaction history: ", bank.get_transaction_history(jane_account));
    console.log("Adam's transaction history: ", bank.get_transaction_history(adam_account));

}

bank_transfer();