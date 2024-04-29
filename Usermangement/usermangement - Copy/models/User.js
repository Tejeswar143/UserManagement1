const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        // unique: true,
        required: true
    },
    Email: {
        type: String,
        // unique: true,
        required: true
    },
    password:
    {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' },

});
module.exports = mongoose.model('User', userSchema);
