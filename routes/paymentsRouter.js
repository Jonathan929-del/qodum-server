// Imports
import express from 'express';
import Payment from '../models/Payment.js';





// Defining router
const router = express.Router();





// Modify student fee heads
router.post('/payment/create', async (req, res) => {
    try {

        // Validations
        const {
            student,
            receipt_no,
            ref_no,
            installments,
            received_date,
            remarks,
            paymode,
            paymode_details,
            fee_type,
            advance_dues_number,
            class_name,
            board,
            adm_no,
            father_name,
            school_name,
            school_address,
            website,
            school_no,
            affiliation_no,
            logo,
            wing_name,
            entry_mode,
            is_new,
            is_active,
            student_status,
            bank_name,
            fee_group,
        
    
            // Amounts
            actual_amount,
            concession_amount,
            paid_amount,
            paid_heads,
            concession_reason
        } = req.body;


        // Creating payment
        await Payment.create({student, receipt_no});


        // Reponse
        res.status(201).send('Payment created');

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;