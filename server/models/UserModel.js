import mongoose from "mongoose";
import {genSalt} from "bcrypt";
import {hash} from "bcrypt";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    firstName:{
        type:String,
        unique:false,
    },
    lastName:{
        type:String,
        unique:false,
    },
    image:{
        type:String,
        unique:false,
    },
    profileSetup:{
        type:Boolean,
        default:false,
    },
});

userSchema.pre("save",async function(next) {
    const salt = await genSalt();
    this.password=await hash(this.password,salt);
    next();
})

const User = mongoose.model("Users",userSchema);
export default User; 