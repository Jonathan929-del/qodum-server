// Imports
import express from 'express';
import StaffType from '../models/StaffTypet.js';





// Defining router
const router = express.Router();





// Fetching staff types
router.get('/names', async (req, res) => {
    try {

        // Staff type
        const staffTypes = await StaffType.find({}, {staff_type:1});


        // Response
        res.status(200).json(staffTypes);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;