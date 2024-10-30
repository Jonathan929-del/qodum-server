// Imports
import express from 'express';
import Alumni from '../models/Alumni.js';
import {validateAlumni} from '../validations/auth.js';





// Defining router
const router = express.Router();





// Add alumni
router.post('/add', async (req, res) => {
    try {

        // Request body
        const {
            first_name,
            last_name,
            email,
            mobile,
            year_of_passing,
            dob,
            maritial_status,
            profession,
            address,
            city,
            state,
            zip_code,
            life_after_graduation,
            fondest_memories
        } = req.body;


        // Validations
        const {valid, errors} = validateAlumni({
            first_name,
            mobile,
            year_of_passing,
            zip_code
        });
        if(!valid){
            errors.status = 'failure';
            res.send(errors);
            return;
        };


        // Adding Alumni
        await Alumni.create({
            first_name,
            last_name,
            email,
            mobile,
            year_of_passing,
            dob,
            maritial_status,
            profession,
            address,
            city,
            state,
            zip_code,
            life_after_graduation,
            fondest_memories
        });


        // Return
        res.status(201).send({
            status:'success',
            message:'Added Successfully'
        });

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;