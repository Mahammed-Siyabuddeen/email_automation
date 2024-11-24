import { Worker } from "bullmq";
import generateMessage from "../controllers/generateMessage";
import redisConnection from "../utils/redisConnection";
import sendGmailsEmail from "../controllers/sendGmailsEmail";
import { mailQueueType } from "../types/mailQueueType";

interface JobType {
    data :mailQueueType
}
const MailQueueWorker = new Worker("email-message",
    async (job:JobType) => {
        console.log("prcessing mail queue");
        
       await sendGmailsEmail(job.data)
    },
    { connection: redisConnection }
);



MailQueueWorker.on("completed", (job) => {
    console.log(`Job with ID ${job.id} has completed`);
});

MailQueueWorker.on("failed", (job, err) => {
    console.error(`Job with ID ${job?.id} failed: ${err.message}`);
});

MailQueueWorker.on("error", (err) => {
    console.error("Worker error:", err);
});


