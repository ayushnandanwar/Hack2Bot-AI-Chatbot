const app = require('./app')
const dotenv = require('dotenv')
const mongoose  = require('mongoose');
dotenv.config({ path: './config.env' });
 
mongoose.connect(process.env.DATABASEURL).then(()=>{
    console.log("DATABASE Connected");
}).catch((err)=>{
    console.log('DATABASE Not Connected' + err);
}) 

app.listen(80,()=>{
    console.log("Server is Running"); 
})  