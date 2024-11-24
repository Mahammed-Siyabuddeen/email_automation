import { tryCatch, Worker } from "bullmq";
import redisConnection from "../utils/redisConnection";
import generateMessage from "../controllers/generateMessage";
import { addJobToGenMsgQueueType } from "../types/addJobToGenMsgQueueType";
import { addJobToMailQueue } from "../queues/mailQueue";
import { mailQueueType } from "../types/mailQueueType";
import parseMessage from "../controllers/parseMessage";
interface JobType {
    data: addJobToGenMsgQueueType
}
const openaiMessageWorker = new Worker("openai-message",
    async (job: JobType) => {
        try {
            const gptResponse = await generateMessage(job.data.question);
            if (!gptResponse)
                 throw Error("fdf")
            const {body,subject } = parseMessage(gptResponse);
            const data = {
                message: body,
                email: job.data.senderEmail,
                subject: subject
            };

            return data;
        } catch (error) {

        }
    },
    { connection: redisConnection }
)


openaiMessageWorker.on("failed", (job, err) => {
    console.error(`Job with ID ${job?.id} failed: ${err.message}`);
});

openaiMessageWorker.on('completed', async (response) => {
    try {

        await addJobToMailQueue(response.returnvalue as mailQueueType)

    } catch (error) {
        console.log(error);

    }


})

