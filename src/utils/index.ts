export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function* userBatchGenerator<T>(items: T[], batchSize: number) {
  for (let i = 0; i < items.length; i += batchSize) {
    yield items.slice(i, i + batchSize);
  }
}
