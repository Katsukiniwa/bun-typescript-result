import { createBankAccount } from "./usecase/command/create-bank-account/create-bank-account";
import { createUser } from "./usecase/command/create-user/create-user";
import { createUserWithInitialDeposit } from "./usecase/command/create-user-with-initial-deposit/create-user-with-initial-deposit";
import { deposit } from "./usecase/command/deposit/deposit";
import { GetUsers } from "./usecase/query/get-users/get-users";

async function main() {
  const argv = process.argv.slice(2);
  const cmd = argv[0];

  switch (cmd) {
    case "create-user": {
      const name = argv[1];
      const r = createUser(name);
      r.match(
        (u) => console.log(`created user ${u.id} ${u.name}`),
        (e) => console.error("error:", e),
      );
      break;
    }

    case "get-users": {
      const r = await GetUsers();
      r.match(
        (u) => console.log(u),
        (e) => console.error("error:", e),
      );
      break;
    }

    case 'create-bank-account': {
      const ownerId = argv[1];
      const r = createBankAccount(Number(ownerId));
      r.match(
        (m) => console.log(`created bank account ${m.id} for owner ${m.ownerId}`),
        (e) => console.error('error:', e)
      );
      break;
    }

    case 'create-user-with-initial-deposit': {
      const userName = argv[1] || "default-user";
      const initialDeposit = parseNumber(argv[2]) ?? 0;
      const r = createUserWithInitialDeposit(userName, initialDeposit);
      r.match(
        (m) => console.log(`created user ${m.id}`),
        (e) => console.error('error:', e)
      );
      break;
    }

    case "deposit": {
      const accountId = parseNumber(argv[1]);
      const amt = parseNumber(argv[2]);
      if (!amt) {
        console.error("usage: deposit <accountId> <amount>");
        return
      }
      const r = deposit(accountId, amt);
      r.match(
        (t) => console.log(`deposited ${t.amount} to account ${t.toAccountId}`),
        (e) => console.error("error:", e),
      );
      break;
    }

    // case 'withdraw': {
    //   const acct = parseNumber(argv[1]);
    //   const amt = parseNumber(argv[2]);
    //   if (!acct || !amt) return console.error('usage: withdraw <accountId> <amount>');
    //   const r = withdraw(acct, amt);
    //   r.match((t) => console.log(`withdrew ${t.amount} from account ${t.fromAccountId}`), (e) => console.error('error:', e));
    //   break;
    // }

    // case 'transfer': {
    //   const from = parseNumber(argv[1]);
    //   const to = parseNumber(argv[2]);
    //   const amt = parseNumber(argv[3]);
    //   if (!from || !to || !amt) return console.error('usage: transfer <fromAccountId> <toAccountId> <amount>');
    //   const r = transfer(from, to, amt);
    //   r.match((t) => console.log(`transferred ${t.amount} ${t.fromAccountId}->${t.toAccountId}`), (e) => console.error('error:', e));
    //   break;
    // }

    // case 'show-account': {
    //   const acct = parseNumber(argv[1]);
    //   if (!acct) return console.error('usage: show-account <accountId>');
    //   const r = showAccount(acct);
    //   r.match((s) => console.log(s), (e) => console.error('error:', e));
    //   break;
    // }

    default:
      console.log(
        `Usage: <command> [args]\n\nCommands:\n create-user <name>\n create-merchant <name>\n create-account <userId> [initialDeposit]\n deposit <accountId> <amount>\n withdraw <accountId> <amount>\n transfer <fromAccountId> <toAccountId> <amount>\n show-account <accountId>\n`,
      );
  }
}

function parseNumber(arg?: string): number {
  if (!arg) {
    throw new Error("argument is required");
  };

  return Number(arg);
}

main().catch((e) => console.error("fatal error", e));
