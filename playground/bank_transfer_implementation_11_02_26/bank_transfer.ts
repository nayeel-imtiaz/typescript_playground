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
    type: TransactionType;
    amount: number;
    sender_id: number;
    recipient_id?: number;

    constructor(type: TransactionType, amount: number, sender_id: number, recipient_id?: number) {
        this.type = type;
        this.amount = amount;
        this.sender_id = sender_id;
        this.recipient_id = recipient_id;
    }
}

class Account {
    id: number;
    name: string;
    balance: number = 0;
    transactions: number[] = [];

    constructor(id: number, name: string, balance?: number, transactions?: number[]) {
        this.id = id;
        this.name = name;
    }
}

class Bank {
    accounts = new Map<number, Account>();
    next_unique_id = 1;

    add_account(name: string) : number {
        let bank_id = this.next_unique_id;
        this.accounts.set(bank_id, new Account(bank_id, name));
        this.next_unique_id += 1;
        return bank_id;
    }

    check_balance(bank_id: number) : number | undefined {
        return this.accounts.get(bank_id)?.balance;
    }

    get_transaction_history(bank_id: number) : number[] | undefined {
        return this.accounts.get(bank_id)?.transactions;
    }
}

function bank_transfer() : void {
    let bank = new Bank();
    let jane_account = bank.add_account("Jane Doe");
    assert.equal(jane_account, 1);
    assert.equal(bank.check_balance(jane_account), 0);
    assert.equal(bank.get_transaction_history(jane_account)?.length, 0);

    console.log("All tests pass.");
}

bank_transfer();