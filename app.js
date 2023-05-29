const express = require('express');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const app = express(); 

const chatservice = require('./controllers/chatservice')


const auth = require('./middlewares/auth')  
const userController = require('./controllers/userController') 

app.use(express.json()) 
app.use(bodyParser.urlencoded({ 
    extended: false
})); 
 
app.set('view engine', 'ejs');
app.use(express.static('public'))  
app.use(cookieParser())
app.use(methodOverride('_method')) 

// client side routes;
app.get('/',(req,res)=>{
    res.render("signup");
})
app.get('/login',(req,res)=>{
    res.render("login");
})
// authenticated routes
app.get('/chat',auth.isAuthenticatd, (req,res)=>{
    req.user.chats.reverse();
    res.render('chatapp',{
        user:req.user
    })
})
  
// backend side serivices 
app.get('/api/chat/',auth.isAuthenticatd,chatservice.chatservice);  // chat bot service;
// user authentication
app.post('/api/user/login',userController.login)
app.post('/api/user/signup',userController.signup)
app.get('/api/user/logout',auth.isAuthenticatd,userController.logout)


  
app.get('*', (req, res) => {   
    res.send("404")
})
module.exports = app;