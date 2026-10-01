// Lightweight In-Memory Client Cache for instant UI responses & zero-flicker tab switching

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cacheStore = new Map<string, CacheEntry<any>>();

export function getCachedData<T>(key: string, maxAgeMs = 30000): T | null {
  const item = cacheStore.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > maxAgeMs) {
    cacheStore.delete(key);
    return null;
  }
  return item.data as T;
}

export function setCachedData<T>(key: string, data: T): void {
  cacheStore.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(keyPrefix?: string): void {
  if (!keyPrefix) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.startsWith(keyPrefix)) {
      cacheStore.delete(key);
    }
  }
}
