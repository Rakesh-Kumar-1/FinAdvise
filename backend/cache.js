import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();
const RedisClient = createClient({
    username: 'default',
    password: process.env.REDIS_Password,
    socket: {
        host: process.env.REDIS_Host,
        port: process.env.REDIS_Port
    }
});

RedisClient.on('error', err => console.log('Redis Client Error', err));

await RedisClient.connect();
export default RedisClient;