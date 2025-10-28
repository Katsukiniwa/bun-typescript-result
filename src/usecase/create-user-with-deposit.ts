import { createBankAccount } from "./create-bank-account";
import { createUser } from "./create-user";
import { deposit } from "./deposit";

export function createUserWithDeposit(name: string, initialDeposit: number) {
  const userResult = createUser(name);

  if (userResult.isErr()) {
    console.error("❌ ユーザー作成失敗:", userResult.error);
    return;
  }

  const accountResult = createBankAccount(userResult.value.id);
  if (accountResult.isErr()) {
    console.error("❌ アカウント作成失敗:", accountResult.error);
    return;
  }

  const depositResult = deposit(accountResult.value, initialDeposit);
  if (depositResult.isOk()) {
    console.log("✅ 初回入金成功:", depositResult.value);
  } else if (depositResult.isErr()) {
    console.error("❌ 入金失敗:", depositResult.error);
  }
}
