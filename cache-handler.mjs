import { IncrementalCache } from 'next/dist/server/lib/incremental-cache';

class CustomCache extends IncrementalCache {
  constructor(options) {
    super(options);
  }

  async get(key) {
    return super.get(key);
  }

  async set(key, data, options) {
    return super.set(key, data, options);
  }
}

export default CustomCache;
