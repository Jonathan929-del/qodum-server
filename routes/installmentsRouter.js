// Imports
import express from 'express';
import Installment from '../models/Installment.js';





// Defining router
const router = express.Router();





// Fetching installments names
router.get('/names', async (req, res) => {
    try {

        // Installments
        const installments = await Installment.find({}, {name:1, due_on_date});


        // Response
        res.status(200).json(installments);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;