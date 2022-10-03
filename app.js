require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
console.log(process.env.API_KEY);
console.log(process.env.SECRET);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded(
    {
        extended: true
    }));

mongoose.connect("mongodb://localhost:27017/userDB");

// Schema for simple uses:-

// const userSchema({
//     email: String,
//     password: String
// });

// Schema for encrypted mongoose (writing method 1):-

// var Schema = mongoose.Schema

// const userSchema = new Schema({
//     email: String,
//     password: String
// });

// // Schema for encrypted mongoose (writing method 2):-

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:["password"] });


const User = new mongoose.model("User", userSchema);

app.get("/", (req,res)=>{
    res.render("home");
});

app.get("/login", (req,res)=>{
    res.render("login");
});

app.get("/register", (req,res)=>{
    res.render("register");
});

app.post("/register", (req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(err) console.log(err);
        else{
            res.render("secrets");
        }
    });
})

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser)=>{
        if(err){
            console.log(err);
        }
        else {
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
                else res.send ("Enter correct password");
            }
            else res.send("Enter correct email id");
        }
    });

});





app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
});