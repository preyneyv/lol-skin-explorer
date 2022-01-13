/**
 * Run before building to precache all the data from the Redis cache.
 */

import Redis from "ioredis";
import fs from "fs/promises";
import path from "path";

import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const CHUNK_SIZE = 120000;

class Cache {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async get(key, initial = null) {
    let str = await this.redis.getrange(key, 0, CHUNK_SIZE - 1);
    if (!str) {
      return initial;
    }

    let data,
      i = 1;
    while (true) {
      try {
        data = JSON.parse(str);
        break;
      } catch (e) {
        if (e instanceof SyntaxError) {
          str +=
            (await this.redis.getrange(
              key,
              CHUNK_SIZE * i,
              CHUNK_SIZE * (i + 1) - 1
            )) || "";
          i++;
        } else {
          throw e;
        }
      }
    }

    return data;
  }

  destroy() {
    this.redis.disconnect();
  }
}

async function downloadKey(key, initial, cache, root) {
  const data = await cache.get(key, initial ?? null);
  await fs.writeFile(path.resolve(root, `${key}.json`), JSON.stringify(data));
}

async function main() {
  const cache = new Cache();
  const root = resolve(dirname(fileURLToPath(import.meta.url)), ".cache");

  await fs.mkdir(root, {
    recursive: true,
  });
  await Promise.all(
    [
      "added",
      "champions",
      "changes",
      "persistentVars",
      "skinlines",
      "skins",
      "universes",
    ].map((k) => downloadKey(k, null, cache, root))
  );
  cache.destroy();
}

main();
