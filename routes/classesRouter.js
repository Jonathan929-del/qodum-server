// Imports
import express from 'express';
import Class from '../models/Class.js';
import AppStudent from '../models/AppStudent.js';





// Defining router
const router = express.Router();





// Fetching classes names
router.get('/names', async (req, res) => {
    try {

        // Classes
        const classes = await Class.find({}, {class_name:1});


        // Response
        res.status(200).json(classes);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Fetching number of students in a class
router.post('/class/student-count', async (req, res) => {
    try {

        // Reques body
        const {class_name} = req.body;

        // Student count
        const studentCount = await AppStudent.countDocuments({'student.class_name':class_name});


        // Response
        res.status(200).json(studentCount);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Fetching students in a class
router.post('/class/students', async (req, res) => {
    try {

        // Reques body
        const {class_name} = req.body;


        // Student count
        const students = await AppStudent.find({'student.class_name':class_name}, {'adm_no':1, 'student.name':1, 'student.roll_no':1});


        // Response
        res.status(200).json(students);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;