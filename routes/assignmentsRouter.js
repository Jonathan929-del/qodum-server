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
        const {creator, creator_image, subject, class_name, title, assignment_date, to_be_submitted_on, attachment, description, is_allow_student_for_multiple_submission, is_active} = req.body;


        // Validations
        const {valid, errors} = validateCreateAssignment({subject, class_name, title, attachment, description});
        if(!valid){
            res.json(errors);
            return;
        };


        // Creating assignment
        await Assignment.create({creator, creator_image, subject, class_name, title, assignment_date, to_be_submitted_on, attachment, description, is_allow_student_for_multiple_submission, is_active});


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
        const {id, subject, title, assignment_date, to_be_submitted_on, attachment, description, is_allow_student_for_multiple_submission, is_active} = req.body;


        // Creating assignment
        await Assignment.findByIdAndUpdate(id, {subject, title, assignment_date, to_be_submitted_on, attachment, description, is_allow_student_for_multiple_submission, is_active});


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





// Fetching assignments with the teacher name
router.post('/teacher', async (req, res) => {
    try {

        // Request body
        const {teacher} = req.body;


        // Validations
        if(!teacher){
            res.send('No teacher name provided');
            return;
        };


        // Assignemts
        const assignments = await Assignment.find({creator:teacher});


        // Response
        res.status(200).json(assignments);
        
    }catch(err){
        res.status(500).json(err);   
    }
});





// Fetching assignments with class name
router.post('/class', async (req, res) => {
    try {

        // Request body
        const {class_name} = req.body;


        // Validations
        if(!class_name){
            res.send('No class name provided');
            return;
        };


        // Assignemts
        const assignments = await Assignment.find({class_name});


        // Response
        res.status(200).json(assignments);
        
    }catch(err){
        res.status(500).json(err);   
    }
});






// Submitting assignment
router.post('/assignment/submit', async (req, res) => {
    try {

        // Body
        const {assignment_id, student, attachment, answer} = req.body;


        // Validations
        if(!assignment_id || !student.adm_no || !student.name || !student.roll_no || !attachment || !answer){

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


        // Submitting report
        await Assignment.findByIdAndUpdate(assignment_id, {$push:{submitted_assignments:{student, answer, attachment, created_at:new Date().toISOString()}}});


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





// Submit feedback to submitted report
router.put('/assignment/feedback', async (req, res) => {
    try {

        // Body
        const {assignment_id, submitted_report_id, feedback, grade} = req.body;


        // Validations
        if(!assignment_id || !submitted_report_id || !feedback || !grade){

            // Assignment ID
            if(!assignment_id || assignment_id.trim() === ''){
                res.json('Please enter assignment ID');
            };

            // Submitted Report ID
            if(!submitted_report_id || submitted_report_id.trim() === ''){
                res.json('Please enter submitted report ID');
            };

            // Feedback
            if(!feedback || feedback.trim() === ''){
                res.json('Please enter feedback');
            };

            // Grade
            if(!grade || grade.trim() === ''){
                res.json('Please enter grade');
            };

        };


        // Sending feedback
        const assignment = await Assignment.findOneAndUpdate(
            {_id:assignment_id, 'submitted_assignments._id':submitted_report_id},
            {
                $set: {
                    'submitted_assignments.$.feedback.feedback':feedback,
                    'submitted_assignments.$.feedback.grade':grade
                }
            },
            {new:true}
        );


        // No assignment or submitted report validation
        if (!assignment) {
            return res.send('Assignment or submitted assignment not found');
        }


        // Response
        res.status(201).json('Feedback sent');

    }catch(err){
        res.status(500).json(err.message);
    }
});





// Export
export default router;