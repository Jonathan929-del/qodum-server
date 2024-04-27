// Imports
import express from 'express';
import School from '../models/School.js';





// Defining router
const router = express.Router();





// Fetching schools
router.get('/', async (req, res) => {
    try {
        const schools = await School.find();
        res.status(200).json(schools);
    } catch (err) {
        res.status(500).json(err);
    }
});





// Fetching school by school no.
router.post('/school', async (req, res) => {
    try {

        // Validations
        const {school_no} = req.body;
        const school = await School.findOne({school_no});
        if(!school){
            res.send('Not found');
            return;
        };


        // Response
        res.status(200).json(school);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;