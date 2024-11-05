import { IRateLimiterService } from "../contracts/IRateLimiterService";
import { NonBurstRateLimiter } from "../entity/NonBurstRateLimiter";
import RedisClient from "./RedisService";

let redis = RedisClient.getInstance();

export class NonBurstRateLimiterService implements IRateLimiterService {
    async canAcceptRequest(nonBurstRateLimiter: NonBurstRateLimiter, key: string): Promise<boolean> {

        const luaScript = `
                            local currentTime = tonumber(ARGV[1])
                            local windowStartTime = currentTime - 1000
                            local key = KEYS[1]
                            local maxRequestsPerSecond = tonumber(ARGV[2])
                            local lockKey = "lock_" .. key

                            if(redis.call("EXISTS",lockKey) == 1)
                            then
                                return false;
                            end

                            redis.call("SET",lockKey,'true','EX',1);

                            redis.call("ZREMRANGEBYSCORE",key,"-inf",windowStartTime)
                            local requestCount = redis.call("ZCARD",key)

                            if requestCount < maxRequestsPerSecond
                            then    
                                redis.call("ZADD",key,currentTime,currentTime)
                                redis.call("EXPIRE",key,1)
                                redis.call("DEL",lockKey)
                                return true;
                            end
                            redis.call("DEL",lockKey)
                            return false;
        `;

        const canAcceptRequest: boolean = await redis.eval(luaScript, 1, key, Date.now(), nonBurstRateLimiter.maxRequestsPerSecond) as boolean;

        return canAcceptRequest;
    }
}