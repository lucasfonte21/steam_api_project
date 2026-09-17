require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const GameLibraryEntry = require('../models/GameLibraryEntry');
const PlaytimeSnapshot = require('../models/PlaytimeSnapshot');

const DAYS_OF_HISTORY = 90;
const SNAPSHOTS_PER_DAY = 2;
const hoursBetweenSnapshots = 24 / SNAPSHOTS_PER_DAY;

const seedSnapshots = async () => {
    await connectDB();

    const user = await User.findOne({});
    if (!user) {
        console.log('No user found. Log in first.');
        process.exit(1);
    }

    console.log(`Seeding history for ${user.displayName}`);

    const games = await GameLibraryEntry.find({ userId: user._id });
    console.log(`Found ${games.length} games`);

    const snapshotsToInsert = [];
    const now = new Date();

    for (const game of games) {
        const finalPlaytime = game.totalPlaytimeMinutes;

        if (finalPlaytime === 0) {
            continue;
        }

        const activeStartDay = Math.floor(Math.random() * DAYS_OF_HISTORY);
        const activeDuration = Math.floor(Math.random() * 30) + 5;
        const activeEndDay = Math.min(activeStartDay + activeDuration, DAYS_OF_HISTORY);

        const playtimeBeforeWindow = Math.floor(finalPlaytime * (Math.random() * 0.5));
        const playtimeInWindow = finalPlaytime - playtimeBeforeWindow;

        for (let day = DAYS_OF_HISTORY; day >= 0; day--) {
            for (let slot = 0; slot < SNAPSHOTS_PER_DAY; slot++) {
                const capturedAt = new Date(now);
                capturedAt.setDate(capturedAt.getDate() - day);
                capturedAt.setHours(slot * hoursBetweenSnapshots, 0, 0, 0);

                if (capturedAt > now) {
                    continue;
                }

                const daysAgo = day;
                let playtimeAtThisPoint;

                if (daysAgo > activeEndDay) {
                    playtimeAtThisPoint = playtimeBeforeWindow;
                } else if (daysAgo < activeStartDay) {
                    playtimeAtThisPoint = finalPlaytime;
                } else {
                    const progressThroughWindow =
                        (activeEndDay - daysAgo) / (activeEndDay - activeStartDay || 1);
                    playtimeAtThisPoint = Math.floor(
                        playtimeBeforeWindow + playtimeInWindow * progressThroughWindow
                    );
                }

                snapshotsToInsert.push({
                    userId: user._id,
                    appId: game.appId,
                    totalPlaytimeMinutes: playtimeAtThisPoint,
                    capturedAt: capturedAt,
                    isSeedData: true
                });
            }
        }
    }

    console.log(`Generated ${snapshotsToInsert.length} snapshots. Inserting...`);

    await PlaytimeSnapshot.insertMany(snapshotsToInsert);

    console.log('Seeding complete');
    await mongoose.connection.close();
    process.exit(0);
};

seedSnapshots().catch(error => {
    console.log('Seeding failed:', error.message);
    process.exit(1);
}); 