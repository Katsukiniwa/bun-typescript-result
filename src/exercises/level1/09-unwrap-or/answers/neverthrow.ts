import { type Result } from "neverthrow";

export const getValueOr = (result: Result<number, string>, defaultValue: number): number =>
  result.unwrapOr(defaultValue);

export const getUserName = (result: Result<{ name: string }, string>): string =>
  result.unwrapOr({ name: "匿名" }).name;
