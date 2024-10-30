// Imports
import express from 'express';
import Job from '../models/Job.js';





// Defining router
const router = express.Router();





// Fetching jobs names
router.get('/names', async (req, res) => {
    try {

        // Jobs
        const jobs = await Job.find({}, {post:1});


        // Response
        res.status(200).json(jobs);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Fetching jobs
router.get('/', async (req, res) => {
    try {

        // Jobs
        const jobs = await Job.find({});


        // Response
        res.status(200).json(jobs);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;