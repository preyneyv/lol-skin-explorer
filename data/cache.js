import Redis from "ioredis";

function chunkString(str, len) {
  const size = Math.ceil(str.length / len);
  const r = Array(size);
  let offset = 0;

  for (let i = 0; i < size; i++) {
    r[i] = str.substr(offset, len);
    offset += len;
  }

  return r;
}

const CHUNK_SIZE = 120000;

export class Cache {
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

  async set(key, value) {
    const data = JSON.stringify(value);
    const split = chunkString(data, CHUNK_SIZE);
    await this.redis.set(key, split[0]);
    for (const chunk of split.slice(1)) {
      await this.redis.append(key, chunk);
    }
  }

  async mset(values) {
    await this.redis.mset(
      Object.keys(values).reduce(
        (obj, key) => ({ ...obj, [key]: JSON.stringify(values[key]) }),
        {}
      )
    );
  }

  destroy() {
    this.redis.disconnect();
  }
}

export const cache = new Cache();
