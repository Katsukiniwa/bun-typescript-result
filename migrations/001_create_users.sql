CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

CREATE TABLE bank_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,
  UNIQUE(owner_id),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_account_id INTEGER NOT NULL,
  to_account_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  memo TEXT,
  FOREIGN KEY (from_account_id) REFERENCES bank_accounts(id),
  FOREIGN KEY (to_account_id) REFERENCES bank_accounts(id)
);
