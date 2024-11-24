import { google } from "googleapis";
import { googelAuth } from "../utils/googleOAuth";
import { addJobToGenMsgQueue } from "../queues/MessageQueue";
import { oauth2Client } from "..";


const getEmailHeader = (headers: any[], name: string): string | undefined => {
    const header = headers?.find((header) => header.name === name);
    return header?.value;
};

const decodeEmailBody = (payload: any): string => {
    const messageParts = payload?.parts?.[0]?.body?.data || payload?.body?.data;
    if (messageParts) {
        return Buffer.from(messageParts, "base64").toString();
    }
    return "";
};

const processEmailMessage = async (gmail: any, emailId: string) => {
    const messageResponse = await gmail.users.messages.get({ userId: "me", id: emailId });
    const payload = messageResponse.data.payload;

    const senderEmail = getEmailHeader(payload?.headers, "From");
    const subject = getEmailHeader(payload?.headers, "Subject");
    const message = decodeEmailBody(payload);

    if (senderEmail && subject) {
        await addJobToGenMsgQueue({
            senderEmail,
            subject,
            question: message,
        });
    } else {
        console.log("Invalid email format.");
    }
};


export const fecthGmailsEmail = async () => {

    try {


        await googelAuth()
        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const res = await gmail.users.messages.list({ userId: "me", q: "in:inbox -from:me", maxResults: 2 });
        const messages = res.data.messages || [];

        for (const email of messages)
            await processEmailMessage(gmail, email.id as string);

    } catch (error) {

        console.log(error);

    }
}