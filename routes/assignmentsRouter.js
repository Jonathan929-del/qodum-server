// Imports
import express from 'express';
import {validateCreateAssignment} from '../validations/assignment.js';
import Assignment from '../models/Assignment.js';





// Defining router
const router = express.Router();





// Creating assignment
router.post('/create', async (req, res) => {
    try {

        // Body
        const {subject, class_name, title, assignment_date, attachment, assignment, is_allow_student_for_multiple_submission, is_active} = req.body;


        // Validations
        const {valid, errors} = validateCreateAssignment({subject, class_name, title, attachment, assignment});
        if(!valid){
            res.json(errors);
            return;
        };


        // Creating assignment
        await Assignment.create({subject, class_name, title, assignment_date, attachment, assignment, is_allow_student_for_multiple_submission, is_active});


        // Response
        res.status(201).json('Created');

    }catch(err){
        res.status(500).json(err);
    }
});





// Fetching assignments
router.get('/', async (req, res) => {
    try {


        // Assignemts
        const assignments = await Assignment.find();


        // Response
        res.status(200).json(assignments);
        
    }catch(err){
        res.status(500).json(err);   
    }
});





// Export
export default router;