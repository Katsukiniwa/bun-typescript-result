import { describe, expect, it, mock } from "bun:test";
import { Result } from "@praha/byethrow";
import { ok } from "neverthrow";
import { createUserWorkflow as createUserWorkflowByethrow } from "./answers/byethrow";
import { createUserWorkflow as createUserWorkflowNeverthrow } from "./answers/neverthrow";

const mockUser = { id: "user-1", name: "Alice", email: "alice@example.com" };

describe("neverthrow", () => {
  describe("createUserWorkflow", () => {
    it("有効な入力・重複なし → Ok(User)", async () => {
      const deps = {
        findByEmail: mock(async () => ok<null, never>(null)),
        save: mock(async () => ok(mockUser)),
      };
      const workflow = createUserWorkflowNeverthrow(deps);
      const result = await workflow({ name: "Alice", email: "alice@example.com" });

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual(mockUser);
      }
      expect(deps.findByEmail).toHaveBeenCalledWith("alice@example.com");
      expect(deps.save).toHaveBeenCalledTimes(1);
    });

    it("既存ユーザーのメール → Err(DuplicateError)", async () => {
      const deps = {
        findByEmail: mock(async () => ok<typeof mockUser, never>(mockUser)),
        save: mock(async () => ok(mockUser)),
      };
      const workflow = createUserWorkflowNeverthrow(deps);
      const result = await workflow({ name: "Alice", email: "alice@example.com" });

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("DuplicateError");
      }
      expect(deps.save).not.toHaveBeenCalled();
    });

    it("名前が2文字以下 → Err(ValidationError)（depsは呼ばれない）", async () => {
      const deps = {
        findByEmail: mock(async () => ok<null, never>(null)),
        save: mock(async () => ok(mockUser)),
      };
      const workflow = createUserWorkflowNeverthrow(deps);
      const result = await workflow({ name: "Al", email: "alice@example.com" });

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("ValidationError");
      }
      expect(deps.findByEmail).not.toHaveBeenCalled();
      expect(deps.save).not.toHaveBeenCalled();
    });

    it("メール形式が不正 → Err(ValidationError)（depsは呼ばれない）", async () => {
      const deps = {
        findByEmail: mock(async () => ok<null, never>(null)),
        save: mock(async () => ok(mockUser)),
      };
      const workflow = createUserWorkflowNeverthrow(deps);
      const result = await workflow({ name: "Alice", email: "notanemail" });

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("ValidationError");
      }
      expect(deps.findByEmail).not.toHaveBeenCalled();
      expect(deps.save).not.toHaveBeenCalled();
    });
  });
});

describe("byethrow", () => {
  describe("createUserWorkflow", () => {
    it("有効な入力・重複なし → Success(User)", async () => {
      const deps = {
        findByEmail: mock(async () => Result.succeed<null>(null)),
        save: mock(async () => Result.succeed(mockUser)),
      };
      const workflow = createUserWorkflowByethrow(deps);
      const result = await workflow({ name: "Alice", email: "alice@example.com" });

      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toEqual(mockUser);
      }
      expect(deps.findByEmail).toHaveBeenCalledWith("alice@example.com");
      expect(deps.save).toHaveBeenCalledTimes(1);
    });

    it("既存ユーザーのメール → Failure(DuplicateError)", async () => {
      const deps = {
        findByEmail: mock(async () => Result.succeed(mockUser)),
        save: mock(async () => Result.succeed(mockUser)),
      };
      const workflow = createUserWorkflowByethrow(deps);
      const result = await workflow({ name: "Alice", email: "alice@example.com" });

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error.type).toBe("DuplicateError");
      }
      expect(deps.save).not.toHaveBeenCalled();
    });

    it("名前が2文字以下 → Failure(ValidationError)（depsは呼ばれない）", async () => {
      const deps = {
        findByEmail: mock(async () => Result.succeed<null>(null)),
        save: mock(async () => Result.succeed(mockUser)),
      };
      const workflow = createUserWorkflowByethrow(deps);
      const result = await workflow({ name: "Al", email: "alice@example.com" });

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error.type).toBe("ValidationError");
      }
      expect(deps.findByEmail).not.toHaveBeenCalled();
      expect(deps.save).not.toHaveBeenCalled();
    });

    it("メール形式が不正 → Failure(ValidationError)（depsは呼ばれない）", async () => {
      const deps = {
        findByEmail: mock(async () => Result.succeed<null>(null)),
        save: mock(async () => Result.succeed(mockUser)),
      };
      const workflow = createUserWorkflowByethrow(deps);
      const result = await workflow({ name: "Alice", email: "notanemail" });

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error.type).toBe("ValidationError");
      }
      expect(deps.findByEmail).not.toHaveBeenCalled();
      expect(deps.save).not.toHaveBeenCalled();
    });
  });
});
