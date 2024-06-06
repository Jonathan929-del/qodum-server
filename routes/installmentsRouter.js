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


        // Months map
        const monthMapping = {
            'January':0,
            'February':1,
            'March':2,
            'April':3,
            'May':4,
            'June':5,
            'July':6,
            'August':7,
            'September':8,
            'October':9,
            'November':10,
            'December':11
        };


        // Is before today function
        const isBeforeToday = dueDate => {
            const {day, month, year} = dueDate;
            const installmentDate = new Date(year, monthMapping[month], day);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set the time of today to midnight to ignore the time part
          
            return installmentDate < today;
        };


        const beforeDueDateInstallments = installments.filter(installment => 
            isBeforeToday(installment.due_on_date)
        );


        // Response
        res.status(200).json(beforeDueDateInstallments);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;