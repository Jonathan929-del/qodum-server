// Imports
import express from 'express';
import Designation from '../models/Designation.js';





// Defining router
const router = express.Router();





// Fetching designations
router.get('/names', async (req, res) => {
    try {

        // Designations
        const designations = await Designation.find({}, {designation:1});


        // Response
        res.status(200).json(designations);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;