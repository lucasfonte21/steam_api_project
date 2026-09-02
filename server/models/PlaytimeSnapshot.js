const mongoose = require('mongoose');

const playtimeSnapshotSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appId: {
        type: Number,
        required: true
    },
    totalPlaytimeMinutes: {
        type: Number,
        required: true
    },
    capturedAt: {
        type: Date,
        default: Date.now
    }
});

playtimeSnapshotSchema.index({ userId: 1, appId: 1, capturedAt: 1 });

const PlaytimeSnapshot = mongoose.model('PlaytimeSnapshot', playtimeSnapshotSchema);

module.exports = PlaytimeSnapshot;