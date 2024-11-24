import { google } from "googleapis";
import { googelAuth } from "../utils/googleOAuth";
import { oauth2Client } from "..";
import { mailQueueType } from "../types/mailQueueType";


async function sendGmailsEmail(data: mailQueueType) {

    try {
        await googelAuth();
        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const emailLines = [
            `To: ${data.email}`,
            'Content - type: text / html; charset = iso - 8859 - 1',
            'MIME-Version: 1.0',
            `Subject: ${data.subject}`,
            '',
            `${data.message}`
        ]
        const email = emailLines.join('\r\n').trim();
        const encodedEmail = Buffer.from(email).toString("base64")

        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedEmail
            }
        })

    } catch (error) {
        console.log("cannot send email", error);

    }
}

export default sendGmailsEmail;