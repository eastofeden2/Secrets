//jshint esversion:6
require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
var encrypt = require('mongoose-encryption');
const app = express()
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}));
mongoose.set('strictQuery', false)
mongoose.connect("mongodb://127.0.0.1:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret = process.env.SECRET
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema)
app.post("/register", (req,res)=>{
    const userEmail = req.body.username
    const password = req.body.password
    const newUser = new User({
        email:userEmail,
        password:password
    })
    newUser.save((err)=>{
        if (err){
            console.log(err);
        }else{
            res.render("secrets")
        }
    })
})

app.post("/login", (req,res)=>{
    const userEmail = req.body.username
    const password = req.body.password
    User.findOne({email:userEmail}, (err,foundUser)=>{
        if (err){
            console.log(err);
        }else{
            if (foundUser.password === password){
                res.render("secrets")
            }
        }
    })
})
app.get("/", (req,res)=>{
    res.render("home");
})

app.get("/login", (req,res)=>{
    res.render("login");
})
app.get("/register", (req,res)=>{
    res.render("register");
})

app.listen(3000, ()=>{
    console.log("server started")
})