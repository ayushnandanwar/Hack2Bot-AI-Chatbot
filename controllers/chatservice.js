const { Configuration, OpenAIApi } = require("openai");
const User = require("../models/userModel")
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });

// Working Key
const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.chatservice = async (req,res)=>{
    try {
        let question = req.query.question;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: question,
            temperature: 0,
            max_tokens: 256,
          });
        //   console.log(response);
          let msg = response.data.choices[0].text;
        //   console.log(msg);
          let user = await User.findById({_id:req.user._id})
          user.chats.push({
            question,
            response:msg
          })
          await user.save();
          res.json({
            success:true,
            response:msg
          }) 
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
    
}