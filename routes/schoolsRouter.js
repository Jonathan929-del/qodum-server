// Imports
import express from 'express';
import School from '../models/School.js';





// Defining router
const router = express.Router();





// Searching schools by school name
router.get('/school', async (req, res) => {
    try {

        // Body
        const {school_name} = req.body;


        // Validation
        if(!school_name){
            res.send('No school name provided');
            return;
        };


        // School name regex
        const schoolNameRegex = new RegExp(school_name, 'i');


        // Schools
        const schools = await School.find({school_name:{$regex:schoolNameRegex}});


        // Response
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
        if(!school_no){
            res.send('No school number provided');
            return;
        };
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