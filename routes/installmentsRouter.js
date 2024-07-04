// Imports
import express from 'express';
import Installment from '../models/Installment.js';
import AdmittedStudent from '../models/AdmittedStudent.js';





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
router.post('/overdues', async (req, res) => {
    try {

        // Request body
        const {adm_no} = req.body;


        // Student fee data
        const student = await AdmittedStudent.findOne({'student.adm_no':adm_no});
        const studentFeeHeads = student.affiliated_heads.heads;


        // Total number generator
        const totalNumberGenerator = numbers => {
            return numbers.reduce((acc, curr) => acc + curr, 0);
        };


        // All installments
        const installments = await Installment.find({}, {name:1, due_on_date:1});
        

        // Today's date
        const today = new Date();
    

        // Convert today to comparable format
        const currentDateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        const currentDate = new Date(currentDateString);
    
        
        // Filter installments where due_on_date is past today's date
        const overdueInstallments = installments.filter(installment => {
            const {day, month, year} = installment.due_on_date;
            const dueDate = new Date(`${year}-${new Date(Date.parse(month +" 1, 2012")).getMonth() + 1}-${day}`);
            return dueDate < currentDate;
        });


        // Installment due amounts
        const installmentDueAmounts = i => {
            const installmentHeads = studentFeeHeads.filter(h => h.installment === i.name || h.installment === 'All installments');
            const installmentHeadsFilteredAmounts = installmentHeads.map(h => h.amounts.filter(a => a.name === i.name)).flat();
            const amountsSum = totalNumberGenerator(installmentHeadsFilteredAmounts.map(a => Number(a.payable_amount === undefined ? a.value : a.last_rec_amount === 0 ? a.value : a.payable_amount)));
            return(amountsSum);
        };


        // Unpaid installments
        const unPaidInstallments = overdueInstallments.filter(i => {
            const installmentAmounts = installmentDueAmounts(i);
            return installmentAmounts > 0;
        });


        // Response
        res.status(200).json(unPaidInstallments);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Fetching installment due on date
router.post('/installment/due-on', async (req, res) => {
    try {

        // Request body
        const {installment_name} = req.body;


        // Student fee data
        const installment = await Installment.findOne({name:installment_name}, {due_date:1});


        // Installment due date
        const installmentDueDate = new Date(`${installment.due_date.day}-${installment.due_date.month}-${installment.due_date.year}`);


        // Response
        res.status(200).json(installmentDueDate);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;