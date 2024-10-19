const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, match:[/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please enter a valid email address']}, 
    phonenumber: { 
        type: String, 
        required: true
    }, 
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true, match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid postal code'] },
        country: { type: String, required: true }
    }, 
    website1: {
        type: String,
        match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, 'Please enter a valid URL']
    }, 
    website2: {
        type: String,
        match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, 'Please enter a valid URL']
    }
});

module.exports = mongoose.model('User', userSchema);
