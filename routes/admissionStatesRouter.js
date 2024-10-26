// Imports
import express from 'express';
import AcademicYear from '../models/AcademicYear.js';
import AdmissionState from '../models/AdmissionState.js';





// Defining router
const router = express.Router();





// Fetching admission states
router.get('/states', async (req, res) => {
    try {

        // Active academic years
        const activeAcademicYear = await AcademicYear.findOne({is_active:true});


        // Admission states
        const states = await AdmissionState.findOne({session:activeAcademicYear?.year_name});


        // Response
        res.status(200).json(states);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;