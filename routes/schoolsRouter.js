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
router.get('/school/:school_no', async (req, res) => {
    try {
        const {school_no} = req.params;
        const school = await School.findOne({school_no});

        if(school){
            res.status(200).json(school);
        }else{
            res.status(404).json('No school found with this school number');
        }

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;