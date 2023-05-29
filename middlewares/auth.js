const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// checks whether user is logged in or not
exports.isAuthenticatd = async(req,res,next)=>{
    try{
        const {token} =req.cookies;
        if(!token){
            return res.json({
                success:false,
                message:"You are not logged in"
            });
        }
        const decoded = await jwt.verify(token,process.env.JWT_SECRET)

        const newUser = await User.findById(decoded._id);
        if(!newUser){
            return res.json({
                success:false,
                message:"You are not logged in"
            });
        }
        req.user = newUser;
        next()
    }catch(err){
        res.json({
            success:false,
            message:"You are not logged in"
        });
    }
}