const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });

const userSchema = new mongoose.Schema({
    full_name:{
        type:String,
        required:[true,"Please Enter your full name"],
        validate: {
            validator: function (value) {
              const nameRegex = /^[a-zA-Z\s]*$/;
              return nameRegex.test(value);
            },
            message: 'Invalid full name',
          },
    },
    email:{
        type:String,
        lowercase:true,
        required:[true,"Please Provide an email"],
        unique:[true,"Email Already exist"],
        validate: {
            validator: function (value) {
              // Regular expression for email validation
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return emailRegex.test(value);
            },
            message: 'Invalid email address',
          },
    },
    mobile_number:{
        type:String,
        required:[true,"Please provide mobile number"],
        unique:[true,"Mobile number already exist"],
        minlength:[10,"Mobile number should be of 10 digits"],
        validate: {
            validator: function (value) {
              const mobileRegex = /^[0-9]{10}$/;
              return mobileRegex.test(value);
            },
            message: 'Invalid mobile number',
          },
    },
    password:{
        type:String,
        select:false,
        minlength:[6,"Password should be greater than 6 character"],
        required:[true,"Please provid your password"],
        validate: {
            validator: function (value) {
              // Regular expression for password validation
              const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
              return passwordRegex.test(value);
            },
            message: 'Password must contain at least one digit, one lowercase and one uppercase letter',
          },
    },
    createdAt:{
        type:Date,
        immutable:true,
        default:Date.now()
    },
    chats:[
        {
            question:String,
            response:String
        }
    ]
})

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,8)
    }
    next();
})


userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateToken = function(){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET)
}
const User = mongoose.model("User",userSchema); 

module.exports = User;