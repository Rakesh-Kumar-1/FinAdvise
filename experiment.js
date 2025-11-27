// import { stringify } from "querystring";
// import RedisClient from "./backend/cache";
// import { $Command } from "@aws-sdk/client-sesv2";

// export const fetchAdvisors = async (req, res, next) => {
//     try {
//         const keyname = 'advisorRedis';
//         const redisAdvisor = await RedisClient.json.get(keyname);
//         if (redisAdvisor) {
//             const redisoutput = JSON.parse(redisAdvisor);
//             return handleResponse(res, 201, "Fetched Advisor (from cache)", true, redisoutput);
//         }
//         const advisor = await Advisor.find({ permission: 'allow' });

//         if (advisor && advisor.length > 0) {
//             advisor.map(async(item)=>{
//                 var id =  item._id;
//                 await RedisClient.hset('advisor',{id},JSON.stringify(item));
//             })
//             await RedisClient.set(keyname, JSON.stringify(advisor));
//             //await RedisClient.expire(keyname, 3600); // 1 hour expiration
//         }
//         return handleResponse(res, 201, "Fetched Advisors (from DB)", true, advisor);

//     } catch (error) {
//         next(error);
//     }
// }




