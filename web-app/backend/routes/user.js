const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const router = express.Router();

console.log("In Login and Resgister")

// Register a User
router.post('/v1/register', async (req, res) => {
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
            lastName: req.body.lastName, 
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                state: req.body.address.state,
                postalCode: req.body.address.postalCode,
                country: req.body.address.country
            }, 
            linkedInUrl: req.body.website1,
            githubUrl: req.body.website2
        })
        const result = await user.save();
        res.status(200).json({
            status: "success",
            message: "User registered successfully!"
        });
    } catch (error) {
        //res.status(500).send(error);
        console.error("Error during registration:", error);
        res.status(500).json({
            status: "error",
            message: "Server error during registration."
        });
    }
});

// Login
router.post('/v1/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            // Compare hashed password
            const isValidPassword = await bcrypt.compare(req.body.password, user.password);
            if (isValidPassword) {
                // Send a JSON response with status and message
                res.status(200).json({
                    status: "success",
                    message: "Logged in successfully."
                });
            } else {
                // Send a JSON response with status and message for incorrect password
                res.status(400).json({
                    status: "error",
                    message: "Incorrect password."
                });
            }
        } else {
            // Send a JSON response with status and message for incorrect username
            res.status(400).json({
                status: "error",
                message: "Incorrect username."
            });
        }
    } catch (error) {
        console.error("Error during login:", error);
        // Send a JSON response with status and message in case of error
        res.status(500).json({
            status: "error",
            message: "Server error during login."
        });
    }
});

module.exports = router;
