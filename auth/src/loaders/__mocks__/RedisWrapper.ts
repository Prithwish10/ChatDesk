/**
 * In-memory Redis mock for unit and integration tests.
 *
 * Supports the exact operations used by OTPRedisRepository:
 *  - pipeline().hset().expire().exec()
 *  - hgetall, del, hincrby, eval (rate-limit Lua script)
 *
 * The hashStore and counterStore are module-level so they persist
 * across calls within a single test and can be reset between tests
 * via __clearStore().
 */
type Hash = Record<string, string>;
const hashStore = new Map<string, Hash>();
const counterStore = new Map<string, number>();
export function __clearStore(): void {
  hashStore.clear();
  counterStore.clear();
}
const client = {
  /** Batches HSET + EXPIRE ops and executes them atomically on exec(). */
  pipeline() {
    const ops: Array<() => void> = [];
    const pipe = {
      hset(key: string, ...fieldValues: string[]) {
        ops.push(() => {
          if (!hashStore.has(key)) hashStore.set(key, {});
          const h = hashStore.get(key)!;
          for (let i = 0; i < fieldValues.length; i += 2) {
            h[fieldValues[i]] = fieldValues[i + 1];
          }
        });
        return pipe;
      }, // TTL is not simulated — keys never auto-expire in tests
      expire(_key: string, _ttl: number) {
        return pipe;
      },
      async exec() {
        ops.forEach((op) => op());
        return [
          [null, 1],
          [null, 1],
        ];
      },
    };
    return pipe;
  },
  async hgetall(key: string): Promise<Hash> {
    const h = hashStore.get(key);
    if (!h || Object.keys(h).length === 0) return {};
    return { ...h };
  },
  async del(key: string): Promise<number> {
    const existed = hashStore.has(key) || counterStore.has(key);
    hashStore.delete(key);
    counterStore.delete(key);
    return existed ? 1 : 0;
  },
  async hincrby(key: string, field: string, increment: number): Promise<number> {
    const h = hashStore.get(key);
    if (!h) return 0;
    const current = parseInt(h[field] ?? '0', 10);
    const next = current + increment;
    h[field] = String(next);
    return next;
  },

  /**
   * Simulates the INCR+EXPIRE Lua rate-limit script.
   * Only the counter increment is relevant for tests; TTL is not enforced.
   */ async eval(_script: string, _numkeys: number, key: string, _ttl: string): Promise<number> {
    const current = (counterStore.get(key) ?? 0) + 1;
    counterStore.set(key, current);
    return current;
  },
  async expire(_key: string, _ttl: number): Promise<number> {
    return 1;
  },
};
export const redisWrapper = {
  client,
  connect: async (_options: any): Promise<void> => undefined,
  disconnect: async (): Promise<void> => undefined,
};
