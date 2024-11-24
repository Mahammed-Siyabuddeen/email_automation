import { google } from 'googleapis'
import { promises as fs } from 'fs'
import { oauth2Client } from '..';



export const googelAuth = async () => {

  try {
    console.log("workingman");

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://mail.google.com/"],
    });

    try {

      const bufferData = await fs.readFile(`${process.cwd()}/gmail-token.json`)
      console.log("Authorize this app by visiting this url:", authUrl);

      oauth2Client.credentials = JSON.parse(bufferData.toString());
    } catch (error) {
      console.log("Authorize this app by visiting this url:", authUrl);
      return null;
    }

    oauth2Client.on("tokens", (tokens) => {

      if (tokens.refresh_token) {
        fs.writeFile(`${process.cwd()}/gmail-token.json`, JSON.stringify(tokens, (error) => {
          if (error)
            console.log("Error saving token", error);
        }))
      }

    })
    return oauth2Client.credentials.access_token;

  } catch (error) {
    console.log("Error in google Authentication", error);
    return null;

  }
}

