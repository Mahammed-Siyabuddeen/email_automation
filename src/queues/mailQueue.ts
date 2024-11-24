import { Queue } from "bullmq";
import redisConnection from "../utils/redisConnection";
import { mailQueueType } from "../types/mailQueueType";

export const MailQueue = new Queue("email-message", {
    connection: redisConnection
});


export const addJobToMailQueue = async (data: mailQueueType) => {
    try {
        console.log("here mail queuue loogg");
        
        MailQueue.add("sendemail", data);
    } catch (error) {
        console.log("cannot able create mailqueue job", error);

    }
}