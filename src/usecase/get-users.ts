import { ok } from "neverthrow";
import { UserRepository } from "../repository/user";
import { userBatchGenerator } from "../utils";

export const GetUsers = async () => {
  const users = new UserRepository().getUsers();
  const generator = userBatchGenerator(users, 5);

  for (const batch of generator) {
    console.log("📦 API送信中:", batch);
    await new Promise((r) => setTimeout(r, 1000));
    console.log("✅ API送信完了");
  }

  return ok("All users processed");
}
