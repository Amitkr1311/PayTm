import express from "express"
const router = express.Router();

import userRouter from "./user.js";
import accountRouter from "./account.js";

router.use("/user", userRouter);
router.use("/account", accountRouter)

export default router;