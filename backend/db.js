import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import { MONGO_URL } from "./config.js";

// mongoose.connect("mongodb+srv://1311amitkr:vGGLtfR3sokm2aEy@cluster0.5ghknrp.mongodb.net/paytm");

mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true, // trim whitespace from both ends
        minlength: 5,
        maxlength: 20,
        lowercase:true
    },
    firstname:{
        type:String,
        required:true,
        trim:true,
        minlength:4,
        maxlength:20
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
        minlength:4,
        maxlength:20
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
        maxlength:30,
    }
})

const accountSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, // References to User model
        ref:"User",
        required:true,
        default:0
    },
    balance:{
        type: Number,
        required: true
    }
},{timestamps: true});

const User = new model("User", userSchema);
const Account = new model("Account", accountSchema);

export {User, Account};