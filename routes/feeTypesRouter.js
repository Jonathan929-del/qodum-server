// Imports
import express from 'express';
import FeeType from '../models/FeeType.js';





// Defining router
const router = express.Router();





// Fetching fee types names
router.get('/names', async (req, res) => {
    try {

        // Fee types
        const feeTypes = await FeeType.find({}, {name:1});


        // Response
        res.status(200).json(feeTypes);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;