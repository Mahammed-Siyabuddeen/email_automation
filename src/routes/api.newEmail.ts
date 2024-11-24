import { Request, Response, Router } from "express";
import { promises as fs } from 'fs'
import { oauth2Client } from "..";
const router = Router();


router.get("/", async (req: Request, res: Response): Promise<any> => {

    try {

        const code = req.query.code as string;

        if (!code)
            return res.status(400).send("No Authorization");

        const { tokens } = await oauth2Client.getToken(code);
        console.log(tokens);

        oauth2Client.setCredentials(tokens);
        res.status(200).send("successfully Authenticated");

        try {

            await fs.writeFile(`${process.cwd()}/gmail-token.json`, JSON.stringify(tokens, null, 2));
        } catch (error) {
            console.log("writing in File cause Error", error);
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send("Authentication failed!");
    }
});


export default router;