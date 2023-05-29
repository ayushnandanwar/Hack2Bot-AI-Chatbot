
const User = require('../models/userModel')

exports.signup = async (req,res)=>{  // creating new account
    try{
        let user = await User.find({email:req.body.email})
        
        if(user.length != 0){
            return res.json({
                success:false,
                message:"User with Email already exists"
            })
        }
        user = await User.find({mobile_number:req.body.mobile_number})
        if(user.length != 0){
            return res.json({
                success:false,
                message:"User with Mobile already exists"
            })
        }
        user = await User.create({
            full_name:req.body.full_name,
            email:req.body.email,
            mobile_number:req.body.mobile_number,
            password:req.body.password 
        })
        await user.save();
        res.json({
            success:true,
            message:"User Registration Successful",
            user
        })
    }catch(err){ 
        res.json({
            success:false,
            message:err.message
        })
    }
}

exports.login = async(req,res)=>{   // signing in existing account/user
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email}).select("+password")
        if(!user){
            return res.json({
                success:false,
                message:"User doesn't exist"
            })
        }
        isMatch = await user.matchPassword(password) 

        if(!isMatch){
            return res.json({
                success:false,
                message:"Incorrect Passowrd"
            })
        }
        const token = await user.generateToken();
        res.status(200).cookie("token",token,{
            expires:new Date(Date.now()+1*24*60*60*1000),
            httpOnly:true
        }).json({
            success:true,
            message:"Login Successful"
        })

    }catch(err){
        res.json({
            success:false,
            message:err.message
        })
    }
}

exports.logout = (req,res)=>{
    res.clearCookie('token');
    res.json({
        message:"Logout successful"
    })
}
