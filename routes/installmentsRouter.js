// Imports
import express from 'express';
import Installment from '../models/Installment.js';





// Defining router
const router = express.Router();





// Fetching installments names
router.get('/names', async (req, res) => {
    try {

        // Installments
        const installments = await Installment.find({}, {name:1, due_on_date:1});


        // Response
        res.status(200).json(installments);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Fetching late installments names
router.get('/overdues', async (req, res) => {
    try {

        // All installments
        const installments = await Installment.find({}, {name:1, due_on_date:1});
        
        
        // Today's date
        const today = new Date();
    

        // Convert today to comparable format
        const currentDateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        const currentDate = new Date(currentDateString);
    
        
        // Filter installments where due_on_date is past today's date
        const overdueInstallments = installments.filter(installment => {
            const { day, month, year } = installment.due_on_date;
            const dueDate = new Date(`${year}-${new Date(Date.parse(month +" 1, 2012")).getMonth() + 1}-${day}`);
            return dueDate < currentDate;
        });


        // Response
        res.status(200).json(overdueInstallments);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;