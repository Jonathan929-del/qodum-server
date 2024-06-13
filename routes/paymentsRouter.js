// Imports
import axios from 'axios';
import crypto from 'crypto';
import express from 'express';
import Payment from '../models/Payment.js';





// Defining router
let paymentStatuses = {};
const router = express.Router();





// Send payment
router.post('/payment/easy-collect', async (req, res) => {
    try {

        // Request body
        const {merchant_txn, name, email, phone, amount, message} = req.body;


        // Generate hash
        const generateHash = data => {
            const hashString = `${data.key}|${data.merchant_txn}|${data.name}|${data.email}|${data.phone}|${data.amount}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}|${data.message}|${process.env.EASEBUZZ_SALT}`;
            return crypto.createHash('sha512').update(hashString).digest('hex');
        };


        // Hash data
        const hashData = {
            key:process.env.EASEBUZZ_KEY,
            merchant_txn,
            name,
            email,
            phone,
            amount,
            udf1:'test',
            udf2:'udf2',
            udf3:'udf3',
            udf4:'udf4',
            udf5:'1',
            message
        };
        hashData.hash = generateHash(hashData);


        // API call
        const easebuzzRes = await axios.post('https://testdashboard.easebuzz.in/easycollect/v1/create', hashData);


        // Response
        res.status(200).send(easebuzzRes.data.data.payment_url);

    } catch (err) {
        res.status(500).send(err);
    }
});





// Handle Easebuzz callback
app.post('/payment/callback', (req, res) => {
    const { txStatus, merchant_txn } = req.body;

    // Update the mock database with the payment status
    paymentStatuses[merchant_txn] = txStatus;

    res.status(200).end();
});

// Fetch payment status
app.get('/payment/status', (req, res) => {
    const { txn_id } = req.query;
    const status = paymentStatuses[txn_id];

    if (status) {
        res.status(200).json({ status });
    } else {
        res.status(404).json({ error: 'Transaction not found' });
    }
});





// Create payment
router.post('/payment/create', async (req, res) => {
    try {

        // Request body
        const {

            // School data
            school_name,
            receipt_no,
            school_address,
            website,
            school_no,
            affiliation_no,
            logo,

            // Student data
            student,
            class_name,
            adm_no,
            father_name,
            is_new,
            is_active,
            student_status,

            // Payment data
            installments,
            received_date,
            fee_type,
            bank_name,
            fee_group,
            actual_amount,
            paid_amount,
            paid_heads
    
        } = req.body;


        // Creating payment
        await Payment.create({
            // School data
            school_name,
            receipt_no,
            school_address,
            website,
            school_no,
            affiliation_no,
            logo,

            // Student data
            student,
            class_name,
            adm_no,
            father_name,
            is_new,
            is_active,
            student_status,

            // Payment data
            installments,
            received_date,
            fee_type,
            bank_name,
            fee_group,
            actual_amount,
            paid_amount,
            paid_heads,
        });


        // Reponse
        res.status(201).send('Payment created');

    } catch (err) {
        res.status(500).json(err);
    }
});





// Create payment
router.post('/payment/last-payment', async (req, res) => {
    try {

        // Request body
        const {adm_no} = req.body;


        // Payment
        const lastPayment = await Payment.findOne({adm_no}).sort({received_date:-1});


        // Reponse
        res.status(200).send(lastPayment ? lastPayment.received_date : 'No payments');

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;