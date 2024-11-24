import { Queue } from "bullmq";
import redisConnection from "../utils/redisConnection";
import { addJobToGenMsgQueueType } from "../types/addJobToGenMsgQueueType";

export const generateMessageQueue = new Queue("openai-message", {
    connection: redisConnection
});

export const addJobToGenMsgQueue = async (data:addJobToGenMsgQueueType) => {
    try {
        
        generateMessageQueue.add("openai",data);

    } catch (error) {
        console.log("job not added to queue",error);
        
    }
}