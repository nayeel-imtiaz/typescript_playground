# Bank Account Transfer System — Review & TODO

**Language:** TypeScript  
**Status:** Core implementation complete; refactoring and edge-case testing remaining.

## Priority 1 — Refactor Map Access

- [ ] Replace repeated `Map.get()` calls with a single lookup stored in a `const`.
- [ ] Avoid non-null assertions (`!`) wherever possible.
- [ ] Use explicit validation and TypeScript type narrowing in `deposit()`, `withdraw()`, and `transfer()`.
- [ ] Keep optional chaining (`?.`) when returning `undefined` is intentional, such as `check_balance()`.

Example:

```typescript
const account = this.accounts.get(bank_id);
if (!account) return false;

// TypeScript now knows account exists.
account.balance += amount;
```

**Key takeaway:** Prefer retrieve → validate → reuse. This applies to Python dictionaries too.

## Priority 2 — Correctness & Edge Cases

- [ ] Reject transfers to the same account (avoids duplicate history entries).
- [ ] Reject `NaN` and `Infinity` using `Number.isFinite(amount)`.
- [ ] Verify invalid operations leave balances and transaction histories unchanged.
- [ ] Consider returning a copy of transaction history to prevent callers from modifying internal state.

## Priority 3 — Expand Tests

- [ ] Invalid account IDs for deposit, withdrawal, and transfer.
- [ ] Zero and negative amounts.
- [ ] Insufficient funds.
- [ ] Self-transfer.
- [ ] Invalid numeric amounts (`NaN`, `Infinity`).
- [ ] Verify transaction details (`type`, `amount`, `sender_id`, `recipient_id`) and ordering.
- [ ] Assert transfer's boolean return value, not just resulting balances.

## TypeScript Concepts to Review

- **`?.`** — Optional chaining; safely returns `undefined` when the receiver is nullish.
- **`!`** — Non-null assertion; suppresses type warnings without runtime protection. Generally avoid.
- **`?` vs. `| undefined`** — Optional parameter/property versus a required declaration whose value may be undefined.
- **Type narrowing** — After checking `if (!account) return false`, TypeScript knows `account` exists.
- **Constructor parameter properties** — `constructor(public id: number)` declares and initializes a field.
- **`private`** — Encapsulates internal class state; appropriate for `Bank.accounts` and `next_unique_id`.

## Final Verification

```bash
npx tsc
npx tsx playground/bank_transfer.ts
```

Once the refactoring and tests pass, mark this exercise complete and move on to the next OOD problem.

**Estimated remaining time:** 20–30 minutes.