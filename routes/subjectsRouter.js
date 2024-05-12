// Imports
import express from 'express';
import Subject from '../models/Subject.js';





// Defining router
const router = express.Router();





// Fetching subjects names
router.get('/names', async (req, res) => {
    try {

        // Subjects
        const subjects = await Subject.find({}, {subject_name:1});


        // Response
        res.status(200).json(subjects);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;