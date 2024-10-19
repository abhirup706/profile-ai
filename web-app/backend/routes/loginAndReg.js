const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const router = express.Router();

console.log("In Login and Resgister")

// Register a User
router.post('/register', async (req, res) => {
    try {
        console.log("Inside Register")
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log(hashedPassword)
        const user = new User({
            username: req.body.username,
            password: hashedPassword, 
            email: req.body.email,
            phonenumber: req.body.phonenumber,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })
        const result = await user.save();
        res.status(200);
        res.send("User Registered!");
    } catch (error) {
        //res.status(500).send(error);
        console.error("Error during registration:", error);
        res.status(500).send({ error: "Server error during registration." });
    }
});

// Login
router.post('/login', async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if(user){
        //compare hashed password
        const isValidPassword = await bcrypt.compare(req.body.password, user.password)
        if(isValidPassword){
            res.status(200).send("Logged in successfully.");
        }
        else{
            res.status(500).send("Incorrect Password");
        }
    }
    else{
        res.status(500).send("Incorrect Username");
    }
});

module.exports = router;
