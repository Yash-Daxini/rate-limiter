import { IRateLimiterService } from "../contracts/IRateLimiterService";
import { BurstRateLimiter } from "../entity/BurstRateLimiter";
import RedisClient from "./RedisService";

let redis = RedisClient.getInstance();

export class BurstRateLimiterService implements IRateLimiterService {
    async canAcceptRequest(burstRateLimiter: BurstRateLimiter, key: string): Promise<boolean> {

        const luaScript = `
                            local key = KEYS[1]
                            local maxRequestsPerSecond = tonumber(ARGV[1])
                            local burstCapacity = tonumber(ARGV[2])
                            local burstCapacityExpiryInSeconds = tonumber(ARGV[3])
                            local currentTimeStamp = tonumber(ARGV[4])

                            if(redis.call("EXISTS",key) == 0)
                            then
                                redis.call("SET",key,cjson.encode({
                                    burstCapacity = maxRequestsPerSecond - 1,
                                    lastRequestTimeStamp = currentTimeStamp
                                }),"EX",burstCapacityExpiryInSeconds)
                                return true
                            end

                            local response = cjson.decode(redis.call("GET", key)) 

                            local currentBurstCapacity = tonumber(response.burstCapacity)

                            local lastRequestTimeStamp = tonumber(response.lastRequestTimeStamp)

                            local elapsedTimeInSeconds = math.floor((currentTimeStamp - lastRequestTimeStamp)/1000)

                            currentBurstCapacity = math.min(currentBurstCapacity + (elapsedTimeInSeconds * maxRequestsPerSecond),burstCapacity)

                            if(currentBurstCapacity > 1)
                            then
                                redis.call("SET",key,cjson.encode({
                                    burstCapacity = currentBurstCapacity - 1,
                                    lastRequestTimeStamp = currentTimeStamp
                                }),"EX",burstCapacityExpiryInSeconds)
                                return true
                            end

                            return false
        `;

        let canAcceptRequest: boolean = await redis.eval(luaScript, 1, key, burstRateLimiter.maxRequestsPerSecond, burstRateLimiter.burstCapacity, burstRateLimiter.burstCapacityExpiryInSeconds, Date.now()) as boolean;

        return canAcceptRequest;
    }
}