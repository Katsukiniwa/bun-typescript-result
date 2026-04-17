import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import {
  close as closeByethrow,
  deposit as depositByethrow,
  freeze as freezeByethrow,
  toAmount as toAmountByethrow,
  unfreeze as unfreezeByethrow,
  withdraw as withdrawByethrow,
} from "./answers/byethrow";
import {
  close as closeNeverthrow,
  deposit as depositNeverthrow,
  freeze as freezeNeverthrow,
  toAmount as toAmountNeverthrow,
  unfreeze as unfreezeNeverthrow,
  withdraw as withdrawNeverthrow,
} from "./answers/neverthrow";

describe("neverthrow", () => {
  const activeWithFunds = {
    _state: "Active" as const,
    balance: toAmountNeverthrow(1000),
  };
  const activeEmpty = {
    _state: "Active" as const,
    balance: toAmountNeverthrow(0),
  };
  const frozenAccount = {
    _state: "Frozen" as const,
    balance: toAmountNeverthrow(500),
    reason: "不正利用の疑い",
  };

  describe("freeze", () => {
    it("Active口座 → Ok(Frozen)", () => {
      const result = freezeNeverthrow(activeWithFunds, "不正利用の疑い");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value._state).toBe("Frozen");
        expect(result.value.reason).toBe("不正利用の疑い");
        expect(result.value.balance).toBe(1000);
      }
    });
  });

  describe("unfreeze", () => {
    it("Frozen口座 → Ok(Active)", () => {
      const result = unfreezeNeverthrow(frozenAccount);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value._state).toBe("Active");
        expect(result.value.balance).toBe(500);
      }
    });
  });

  describe("close", () => {
    it("残高0のActive口座 → Ok(Closed)", () => {
      const result = closeNeverthrow(activeEmpty);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value._state).toBe("Closed");
      }
    });

    it("残高ありのActive口座 → Err(FundsRemainingError)", () => {
      const result = closeNeverthrow(activeWithFunds);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error._tag).toBe("FundsRemainingError");
        expect(result.error.balance).toBe(1000);
      }
    });
  });

  describe("deposit", () => {
    it("入金 → Ok(Active with updated balance)", () => {
      const result = depositNeverthrow(activeWithFunds, toAmountNeverthrow(500));
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value._state).toBe("Active");
        expect(result.value.balance).toBe(1500);
      }
    });
  });

  describe("withdraw", () => {
    it("十分な残高がある → Ok(Active with reduced balance)", () => {
      const result = withdrawNeverthrow(activeWithFunds, toAmountNeverthrow(300));
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value._state).toBe("Active");
        expect(result.value.balance).toBe(700);
      }
    });

    it("残高不足 → Err(InsufficientFundsError)", () => {
      const result = withdrawNeverthrow(activeWithFunds, toAmountNeverthrow(2000));
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error._tag).toBe("InsufficientFundsError");
        expect(result.error.balance).toBe(1000);
        expect(result.error.amount).toBe(2000);
      }
    });
  });
});

describe("byethrow", () => {
  const activeWithFunds = {
    _state: "Active" as const,
    balance: toAmountByethrow(1000),
  };
  const activeEmpty = {
    _state: "Active" as const,
    balance: toAmountByethrow(0),
  };
  const frozenAccount = {
    _state: "Frozen" as const,
    balance: toAmountByethrow(500),
    reason: "不正利用の疑い",
  };

  describe("freeze", () => {
    it("Active口座 → Success(Frozen)", () => {
      const result = freezeByethrow(activeWithFunds, "不正利用の疑い");
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value._state).toBe("Frozen");
        expect(result.value.reason).toBe("不正利用の疑い");
        expect(result.value.balance).toBe(1000);
      }
    });
  });

  describe("unfreeze", () => {
    it("Frozen口座 → Success(Active)", () => {
      const result = unfreezeByethrow(frozenAccount);
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value._state).toBe("Active");
        expect(result.value.balance).toBe(500);
      }
    });
  });

  describe("close", () => {
    it("残高0のActive口座 → Success(Closed)", () => {
      const result = closeByethrow(activeEmpty);
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value._state).toBe("Closed");
      }
    });

    it("残高ありのActive口座 → Failure(FundsRemainingError)", () => {
      const result = closeByethrow(activeWithFunds);
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error._tag).toBe("FundsRemainingError");
        expect(result.error.balance).toBe(1000);
      }
    });
  });

  describe("deposit", () => {
    it("入金 → Success(Active with updated balance)", () => {
      const result = depositByethrow(activeWithFunds, toAmountByethrow(500));
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value._state).toBe("Active");
        expect(result.value.balance).toBe(1500);
      }
    });
  });

  describe("withdraw", () => {
    it("十分な残高がある → Success(Active with reduced balance)", () => {
      const result = withdrawByethrow(activeWithFunds, toAmountByethrow(300));
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value._state).toBe("Active");
        expect(result.value.balance).toBe(700);
      }
    });

    it("残高不足 → Failure(InsufficientFundsError)", () => {
      const result = withdrawByethrow(activeWithFunds, toAmountByethrow(2000));
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error._tag).toBe("InsufficientFundsError");
        expect(result.error.balance).toBe(1000);
        expect(result.error.amount).toBe(2000);
      }
    });
  });
});
