
import express from 'express';
import api from './routes/api';
import { google } from 'googleapis'
import { configDotenv } from 'dotenv';
import { fecthGmailsEmail } from './controllers/fecthGmailsEmail';

import  './worker/openaiMessage.worker';
import  './worker/mailQueue.worker';
const app = express();

app.use(express.json());
configDotenv();
const port = 9000;

export const oauth2Client = new google.auth.OAuth2(
    process.env.client_id,
    process.env.client_secret,
    'http://localhost:9000/api/newmessage'
);


fecthGmailsEmail();

app.use('/api', api);

app.listen(port, () => {
    console.log(`server running on port http://localhost:${port}`);

})