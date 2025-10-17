import { accounts } from "./repository";
import { createUser } from "./usecase/create-user";
import { deposit } from "./usecase/deposit";

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

    // case 'create-merchant': {
    //   const name = argv[1];
    //   const r = createMerchant(name);
    //   r.match(
    //     (m) => console.log(`created merchant ${m.id} ${m.name}`),
    //     (e) => console.error('error:', e)
    //   );
    //   break;
    // }

    // case 'create-account': {
    //   const userId = parseNumber(argv[1]);
    //   const initial = parseNumber(argv[2]) ?? 0;
    //   if (!userId) return console.error('usage: create-account <userId> [initialDeposit]');
    //   const r = createAccountForUser(userId, initial);
    //   r.match((a) => console.log(`created account ${a.id} for user ${a.ownerId}`), (e) => console.error('error:', e));
    //   break;
    // }

    case "deposit": {
      const acc = accounts.get(Number(argv[1]));
      const amt = parseNumber(argv[2]);
      if (!acc || !amt) return console.error("usage: deposit <accountId> <amount>");
      const r = deposit(acc, amt);
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

function parseNumber(arg?: string): number | null {
  if (!arg) return null;
  const n = Number(arg);
  return Number.isFinite(n) ? n : null;
}

main().catch((e) => console.error("fatal error", e));
