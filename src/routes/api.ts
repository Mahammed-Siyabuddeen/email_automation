import { Router } from "express";
import newEmail from './api.newEmail'
const router = Router();


router.use("/newmessage",newEmail);

export default router;