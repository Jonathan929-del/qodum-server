// Imports
import express from 'express';
import { validateCreateAssignment } from '../validations/assignment';





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



        // Response
        res.status(200).json('Created');

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;