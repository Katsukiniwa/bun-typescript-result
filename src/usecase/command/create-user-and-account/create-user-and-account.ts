import { createBankAccount } from "../create-bank-account/create-bank-account";
import { createUser } from "../create-user/create-user";

export function createUserAndAccount(name: string) {
  const result = createUser(name)
    // 成功時にユーザーIDを文字列メッセージに変換
    .map((user) => `ユーザー作成成功: ${user.name} (ID: ${user.id})`)
    // 失敗時にエラーメッセージを装飾
    .mapErr((errMsg) => `⚠️ エラー発生: ${errMsg}`);

  if (result.isOk()) {
    console.log(result.value); // 成功メッセージ
  } else if (result.isErr()) {
    console.error(result.error); // 装飾されたエラーメッセージ
  }

  // さらに、成功時にアカウントを作るチェーン例
  const accountResult = createUser(name)
    .andThen(user => createBankAccount(user.id))
    .map((account) => `アカウント作成成功: AccountID=${account.id}, OwnerID=${account.ownerId}`)
    .mapErr((errMsg) => `アカウント作成でエラー: ${errMsg}`);

  if (accountResult.isOk()) {
    console.log(accountResult.value);
  } else {
    console.error(accountResult.error);
  }
}
