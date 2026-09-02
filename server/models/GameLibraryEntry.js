const mongoose = require('mongoose');

const gameLibraryEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    totalPlaytimeMinutes: {
        type: Number,
        default: 0
    },
    playtimeLastTwoWeeks: {
        type: Number,
        default: 0
    },
    imgIconUrl: {
        type: String
    },
    lastSyncedAt: {
        type: Date,
        default: Date.now
    }
});

gameLibraryEntrySchema.index({ userId: 1, appId: 1 }, { unique: true });

const GameLibraryEntry = mongoose.model('GameLibraryEntry', gameLibraryEntrySchema);

module.exports = GameLibraryEntry;  