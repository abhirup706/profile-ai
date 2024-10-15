const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, match:[/^\S+@\S+\.\S+$/, 'Please enter a valid email address']}, 
    phonenumber: { 
        type: String, 
        required: true, 
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
    }, 
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);
