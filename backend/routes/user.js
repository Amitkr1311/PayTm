// const express = require("express");
// const router = express.Router();
// const zod = require("zod");
// const {User, Account} = require("../db");
// const { JWT_SECRET } = require("../config");
// const jwt = require("jsonwebtoken");
// const { authMiddleware } = require("../middleware");

import express from "express";
import { z } from "zod";
import { User, Account } from "../db.js";
import  JWT_SECRET from "../config.js";
import jwt from "jsonwebtoken";
import  authMiddleware  from "../middleware.js";

const router = express.Router();

const signupSchema = z.object({
    username: z.string().email(),
    firstname: z.string(),
    lastname: z.string(),
    password: z.string()
})

router.post("/signup", async (req,res) => {
    const parsed = signupSchema.safeParse(req.body);

    if(!parsed.success){
        res.status(400).json({
            message: "Invalid data",
            errors: parsed.error.errors,
        })
        return;
    }

    const body = parsed.data;

    const existingUser = await User.findOne({username:body.username});
    if(existingUser) {
        return res.status(411).json({
            message:"Username already taken"
        })
    }

    const user = await User.create({
        username:  body.username,
        firstname: body.firstname,
        lastname:  body.lastname,
        password:  body.password,
    })

    //const userId = user._id;

    const randomBal = Math.floor(Math.random() * (10000 - 1000)) + 1000;

    await Account.create({
        userId: user._id,
        balance: randomBal
    })

    const token = jwt.sign({userId: user._id}, JWT_SECRET);

    res.status(200).json({
        message: "User created successfully",
        token:token
    });
});

const signinSchema = z.object({
    username: z.string().email(),
    password: z.string(),
})

router.post("/signin", async (req,res) => {

    const parsed = signinSchema.safeParse(req.body);
    if(!parsed.success) {
        res.status(400).json({
            message: "Invalid Credentials",
            errors: parsed.error.errors,
        })
        return;
    }

    const body = parsed.data;

    const user = await User.findOne({
        username: body.username,
        password: body.password
    })

    if (!user) {
            return res.status(401).json({
            message: "Invalid username or password",
        });
    }

    const token = jwt.sign({userId:user._id}, JWT_SECRET);
    
    res.status(200).json({
        message: "user Signed in",
        token: token
    });
});

const updateSchema = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    password: z.string().optional(),
})

router.put("/update", authMiddleware, async (req,res) => {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: parsed.error.errors,
        });
    }
        
    const body = parsed.data;
    const userId = req.userId;
    const updatedData = {};
    
    if (body.firstname) updatedData.firstname = body.firstname;
    if (body.lastname) updatedData.lastname = body.lastname;
    if (body.password) updatedData.password = body.password;

    try {
        await User.updateOne({ _id: userId }, { $set: updatedData });

        res.status(200).json({
        message: "User updated successfully",
        updatedFields: Object.keys(updatedData),
        });
    } 
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }

})

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.json({
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
    $or:[
          { firstname: { $regex: filter, $options: "i" } },
          { lastlame: { $regex: filter, $options: "i" } }
        ],
    })
        .select("username firstname lastname _id")
        .limit(20);

    res.status(200).json({ users });
})

// module.exports = router;
export default router;