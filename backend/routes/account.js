// const express = require("express");
// const router = express.Router();
// const {User, Account} = require("../db")
// const { authMiddleware } = require("../middleware");

import express from "express";
import { User, Account } from "../db.js";
import mongoose from "mongoose";
import  authMiddleware  from "../middleware.js";

const router = express.Router();

router.get("/balance", authMiddleware, async (req,res) => {
    const userId = req.userId;

    const account = await Account.findOne({userId: userId});

    if(account) {
        res.status(200).json({
            balance: account.balance
        })
        return;
    }

    res.status(404).json({
        message: "Account Not Found"
    })
})

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});


export default router;