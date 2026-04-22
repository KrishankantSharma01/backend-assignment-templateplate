import { createClient  } from 'redis';
import env from '../config/env.js';

class RedisCacheService {
  constructor() {
    this.client = createClient({
      url: env.redisUrl || "redis://127.0.0.1:6379",
      socket: {
        reconnectStrategy: false,
      },
    });

    this.client.on("error", (err) => {
      // suppress error in test env
      if (process.env.NODE_ENV !== "test") {
        console.error("Redis Client Error:", err.message);
      }
    });

    this.connected = false;
    this.client.connect()
      .then(() => {
        this.connected = true;
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== "test") {
          console.error("Redis connection failed:", err.message);
        }
      });
  }

  async get(key) {
    if (!this.connected) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      if (process.env.NODE_ENV !== "test") {
        console.error("Redis GET error:", error);
      }
      return null;
    }
  }

  async set(key, value, ttlSeconds = env.cacheTtlSeconds) {
    if (!this.connected) return;
    try {
      await this.client.set(key, JSON.stringify(value), {
        EX: ttlSeconds,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "test") {
        console.error("Redis SET error:", error);
      }
    }
  }

  async delete(key) {
    if (!this.connected) return;
    try {
      await this.client.del(key);
    } catch (error) {
      if (process.env.NODE_ENV !== "test") {
        console.error("Redis DEL error:", error);
      }
    }
  }
}

export default new RedisCacheService();
