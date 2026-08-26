const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    steamId64: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String
    },
    profileUrl: {
        type: String
    },
    linkedAt: {
        type: Date,
        default: Date.now
    },
    lastSyncedAt: {
        type: Date
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;