import { response } from "express";
import userModel from "../models/UserModel.js";
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET_KEY);
}

const loginUser = async (req,res) =>{
    try{
        const {email, password} = req.body;

        const user= await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"User doesnot Exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = createToken(user._id);
            res.json({success:true, token});
        }
        else{
            return res.json({success:false, message:"wrong password"});
        }

    } catch(error){
        console.log(error);
        return res.json({success:false, message:"Error while login user :: "+error.message});
    }

}

const registerUser = async (req,res) =>{
    try{
        const {name, email, password} = req.body;

        const exists= await userModel.findOne({email});
        if(exists){
            return res.json({success:false, message:"User already Exist"});
        }

        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Enter valid Email"});
        }
        if(password.length < 8){
            return res.json({success:false, message:"Enter Strong Password"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name, email, password:hashedPassword
        })
        const user = await newUser.save();

        const token = createToken(user._id);
        res.json({success:true, token})


    } catch(error){
        console.log(error);
        return res.json({success:false, message:"Error while registering user :: "+error.message});
    }
}

const adminLogin = async (req,res)=>{
    try{
        const {email, password} = req.body;
        if(email===process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET_KEY);
            res.json({
                success:true, token
            })
        }
        else{
            res.json({
                success:false, message:"invalid credentials"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.json({success:false, message:"Error while login admin :: "+error.message});
    }
}

export {loginUser, registerUser, adminLogin};