// Imports
import express from 'express';
import Assignment from '../models/Assignment.js';
import {validateCreateAssignment} from '../validations/assignment.js';





// Defining router
const router = express.Router();





// Creating assignment
router.post('/create', async (req, res) => {
    try {

        // Body
        const {creator, creator_image, subject, class_name, title, assignment_date, to_be_submitted_on, attachment, assignment, is_allow_student_for_multiple_submission, is_active} = req.body;


        // Validations
        const {valid, errors} = validateCreateAssignment({subject, class_name, title, attachment, assignment});
        if(!valid){
            res.json(errors);
            return;
        };


        // Creating assignment
        await Assignment.create({creator, creator_image, subject, class_name, title, assignment_date, to_be_submitted_on, attachment, assignment, is_allow_student_for_multiple_submission, is_active});


        // Response
        res.status(201).json('Created');

    }catch(err){
        res.status(500).json(err);
    }
});





// Editing assignment
router.post('/edit', async (req, res) => {
    try {

        // Body
        const {id, subject, title, assignment_date, to_be_submitted_on, attachment, assignment, is_allow_student_for_multiple_submission, is_active} = req.body;


        // Creating assignment
        await Assignment.findByIdAndUpdate(id, {subject, title, assignment_date, to_be_submitted_on, attachment, assignment, is_allow_student_for_multiple_submission, is_active});


        // Response
        res.status(201).json('Edited');

    }catch(err){
        res.status(500).json(err);
    }
});





// Deleting assignment
router.delete('/delete/:id', async (req, res) => {
    try {

        // Params
        const {id} = req.params;

        // Assignemts
        await Assignment.findByIdAndDelete(id);


        // Response
        res.status(200).json('Deleted');
        
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






// Editing assignment
router.post('/assignment/submit', async (req, res) => {
    try {

        // Body
        const {assignment_id, student, attachment, answer} = req.body;


        // Validations
        if(!assignment_id || !student.adm_no || !student.name || !student.roll_no || !attachment || !answer){
            const errors = {};

            // Assignment ID
            if(!assignment_id || assignment_id.trim() === ''){
                res.json('Please enter assignment ID');
            };

            // Student admission number
            if(!student?.adm_no || student?.adm_no?.trim() === ''){
                res.json('Please enter student admission number');
            };

            // Student name
            if(!student?.name || student?.name?.trim() === ''){
                res.json('Please enter student name');
            };

            // Student roll number
            if(!student?.roll_no || student?.roll_no.trim() === ''){
                res.json('Please enter student roll number');
            };

            // Attachment
            if(!attachment || attachment.trim() === ''){
                res.json('Please enter an attachment');
            };

            // Answer
            if(!answer || answer.trim() === ''){
                res.json('Please enter an answer');
            };

        };


        // Creating assignment
        await Assignment.findByIdAndUpdate(assignment_id, {$push:{submitted_assignments:{student, answer, attachment, created_at:new Date()}}});


        // Response
        res.status(201).json('Submitted');

    }catch(err){
        res.status(500).json(err.message);
    }
});





// Fetching assignment by id
router.get('/assignment/:id', async (req, res) => {
    try {


        // Request params
        const {id} = req.params;


        // Assignemts
        const assignment = await Assignment.findById(id);


        // Response
        res.status(200).json(assignment);
        
    }catch(err){
        res.status(500).json(err);   
    }
});





// Export
export default router;