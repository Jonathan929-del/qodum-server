// Imports
import express from 'express';
import School from '../models/School.js';





// Defining router
const router = express.Router();





// Searching schools by school name
router.post('/find', async (req, res) => {
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
        const schools = await School.find({school_name:{$regex:schoolNameRegex}}, {logo:1, school_name:1, school_no:1});


        // Response
        res.status(200).json(schools);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Update school data to the app
router.post('/update', async (req, res) => {
    try {

        // Body
        const {id} = req.body;


        // Validation
        if(!id){
            res.send('No ID provided');
            return;
        };


        // Schools
        const school = await School.findById(id);


        // Response
        res.status(200).json(school);

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