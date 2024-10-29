// Imports
import express from 'express';
import AcademicYear from '../models/AcademicYear.js';
import AdmissionGuideline from '../models/AdmissionGuideline.js';





// Defining router
const router = express.Router();





// Fetching guide lines
router.get('/', async (req, res) => {
    try {

        // Active academic years
        const activeAcademicYear = await AcademicYear.findOne({is_active:true});


        // Guide line
        const guideLine = await AdmissionGuideline.findOne({session:activeAcademicYear?.year_name});


        // Response
        res.status(200).json(guideLine);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;