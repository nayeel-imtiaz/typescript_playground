import * as assert from "node:assert/strict";

// Equivalent to Python's Enum
enum TransactionType {
  WITHDRAW = "withdraw",
  DEPOSIT = "deposit",
  TRANSFER = "transfer",
}

// Equivalent to Python's @dataclass
class Transaction {
  constructor(
    public type: TransactionType,
    public amount: number,
    public senderId: number,
    public recipientId: number | null = null
  ) {}
}

class Account {
  public balance: number = 0;
  public transactions: Transaction[] = [];

  constructor(
    public id: number,
    public name: string
  ) {}
}

class Bank {
  private accounts: Map<number, Account> = new Map();
  private nextUniqueId: number = 1;

  addAccount(name: string): number {
    const bankId = this.nextUniqueId;

    this.accounts.set(bankId, new Account(bankId, name));
    this.nextUniqueId++;

    return bankId;
  }

  checkBalance(accountId: number): number | undefined {
    return this.accounts.get(accountId)?.balance;
  }

  getTransactionHistory(
    accountId: number
  ): Transaction[] | undefined {
    return this.accounts.get(accountId)?.transactions;
  }

  deposit(accountId: number, amount: number): boolean {
    const account = this.accounts.get(accountId);

    if (!Number.isSafeInteger(amount) || amount <= 0 || !account) {
      return false;
    }

    account.balance += amount;

    account.transactions.push(
      new Transaction(TransactionType.DEPOSIT, amount, accountId)
    );

    return true;
  }

  withdraw(accountId: number, amount: number): boolean {
    const account = this.accounts.get(accountId);

    if (
      !Number.isSafeInteger(amount) ||
      amount <= 0 ||
      !account ||
      account.balance < amount
    ) {
      return false;
    }

    account.balance -= amount;

    account.transactions.push(
      new Transaction(TransactionType.WITHDRAW, amount, accountId)
    );

    return true;
  }

  transfer(
    sendingAccountId: number,
    receivingAccountId: number,
    amount: number
  ): boolean {
    const sender = this.accounts.get(sendingAccountId);
    const recipient = this.accounts.get(receivingAccountId);

    if (
      !Number.isSafeInteger(amount) ||
      amount <= 0 ||
      !sender ||
      !recipient ||
      sendingAccountId === receivingAccountId ||
      sender.balance < amount
    ) {
      return false;
    }

    sender.balance -= amount;
    recipient.balance += amount;

    const transaction = new Transaction(
      TransactionType.TRANSFER,
      amount,
      sendingAccountId,
      receivingAccountId
    );

    sender.transactions.push(transaction);
    recipient.transactions.push(transaction);

    return true;
  }
}

// Tests

function bank_transfer(): void {
  const bank = new Bank();

  const janeAccount = bank.addAccount("Jane Doe");

  assert.equal(janeAccount, 1);
  assert.equal(bank.checkBalance(janeAccount), 0);
  assert.equal(bank.getTransactionHistory(janeAccount)?.length, 0);

  assert.equal(bank.deposit(janeAccount, 100), true);
  assert.equal(bank.checkBalance(janeAccount), 100);
  assert.equal(bank.getTransactionHistory(janeAccount)?.length, 1);

  assert.equal(bank.withdraw(janeAccount, 50), true);
  assert.equal(bank.checkBalance(janeAccount), 50);
  assert.equal(bank.getTransactionHistory(janeAccount)?.length, 2);

  const adamAccount = bank.addAccount("Adam Smith");

  assert.equal(adamAccount, 2);

  assert.equal(bank.transfer(janeAccount, adamAccount, 50), true);
  assert.equal(bank.checkBalance(janeAccount), 0);
  assert.equal(bank.checkBalance(adamAccount), 50);

  assert.equal(bank.getTransactionHistory(janeAccount)?.length, 3);
  assert.equal(bank.getTransactionHistory(adamAccount)?.length, 1);

  const beforeBalance = bank.checkBalance(adamAccount);
  const beforeTransactionsLength =
    bank.getTransactionHistory(adamAccount)?.length;

  assert.equal(bank.transfer(adamAccount, adamAccount, 10), false);
  assert.equal(bank.checkBalance(adamAccount), beforeBalance);
  assert.equal(
    bank.getTransactionHistory(adamAccount)?.length,
    beforeTransactionsLength
  );

  console.log("All tests so far pass.");

  console.log("Jane's history:", bank.getTransactionHistory(janeAccount));
  console.log("Adam's history:", bank.getTransactionHistory(adamAccount));
}

bank_transfer();
