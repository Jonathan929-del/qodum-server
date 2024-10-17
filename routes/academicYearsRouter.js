// Imports
import express from 'express';
import AcademicYear from '../models/AcademicYear.js';





// Defining router
const router = express.Router();





// Last payment
router.get('/names', async (req, res) => {
    try {

        // Payment
        const academic_years = await AcademicYear.find({}, {year_name:1});


        // Reponse
        res.status(200).send(academic_years);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;