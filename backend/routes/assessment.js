const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

// 1. Submit Assessment (Creates a NEW record for longitudinal history)
router.post('/submit', async (req, res) => {
    try {
        const { userId, answers } = req.body;

        const pItems = [1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 15, 16, 17, 30];
        const hItems = [18, 20, 21, 22, 24, 25, 26, 27, 29];
        const nItems = [6, 7, 12, 14, 19, 23, 28]; // Reverse scored

        let p = 0, h = 0, n = 0;
        
        answers.forEach(a => {
            let val = parseInt(a.val);
            if (pItems.includes(a.qId)) {
                p += val;
            } else if (hItems.includes(a.qId)) {
                h += val;
            } else if (nItems.includes(a.qId)) {
                n += (6 - val); // Flip: 5 becomes 1
            }
        });

        const report = new Assessment({
            student: userId,
            perseverance: p,
            helpSeeking: h,
            negativeAffect: n,
            totalScore: p + h + n,
            date: new Date() 
        });

        await report.save();
        res.status(201).json(report);
    } catch (err) {
        res.status(500).json({ error: "Failed to save assessment" });
    }
});

// 2. Global Benchmarks (Aggregates average scores of ALL students)
router.get('/global-stats', async (req, res) => {
    try {
        const stats = await Assessment.aggregate([
            {
                $group: {
                    _id: null,
                    avgPerseverance: { $avg: "$perseverance" },
                    avgHelpSeeking: { $avg: "$helpSeeking" },
                    avgNegativeAffect: { $avg: "$negativeAffect" },
                    totalStudents: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            res.json(stats[0]);
        } else {
            // Default values if no one has taken the test
            res.json({
                avgPerseverance: 0,
                avgHelpSeeking: 0,
                avgNegativeAffect: 0,
                totalStudents: 0
            });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to calculate global stats" });
    }
});

// 3. User History (For the Line Chart)
router.get('/user-history/:userId', async (req, res) => {
    try {
        const history = await Assessment.find({ student: req.params.userId }).sort({ date: 1 });
        res.json(history);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 4. Latest User Result (For Overview)
router.get('/user-result/:userId', async (req, res) => {
    try {
        const result = await Assessment.findOne({ student: req.params.userId }).sort({ date: -1 });
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;