const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());

mongoose.connect("mongodb://localhost:27017/userDB");

// var Schema = mongoose.Schema

// const userSchema = new Schema({
//     email: String,
//     password: String
// });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "This is our little secret.";
userSchema.plugin(encrypt, {secret: secret, encryptedFields:["password"] });


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