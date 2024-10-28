// Imports
import express from 'express';
import AcademicYear from '../models/AcademicYear.js';
import AdmissionState from '../models/AdmissionState.js';
import StationaryDetails from '../models/StationaryDetails.js';





// Defining router
const router = express.Router();





// Fetching admission states
router.get('/online-details', async (req, res) => {
    try {

        // Active academic years
        const activeAcademicYear = await AcademicYear.findOne({is_active:true});


        // Admission states
        const states = await StationaryDetails.findOne({session:activeAcademicYear?.year_name, is_online:true});


        // Response
        res.status(200).json(states);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;