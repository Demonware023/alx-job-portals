// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    type: {
        type: String,
        enum: ['user', 'company'],
        required: true,
    },
    skills: {
        type: [String],
        default: [],
    },
    profilePicture: {
        type: String,
        default: 'defaultProfilePic.png', // Default profile picture
    },
}, { timestamps: true });

// Hash the user's password before saving to the database
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Export the User model
module.exports = mongoose.model('User', UserSchema);
