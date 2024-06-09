// Imports
import crypto from 'crypto';
import express from 'express';
import Payment from '../models/Payment.js';





// Defining router
const router = express.Router();





// Generate hash function
const generateHash = data => {
    const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}|${data.udf6}|${data.udf7}|${data.udf8}|${data.udf9}|${data.udf10}|${process.env.EASEBUZZ_SALT}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
};





// Send payment
router.post('/payment/initiate-payment', async (req, res) => {
    try {

        // Request body
        const {amount, purpose} = req.body;


        // Prepare data for Easebuzz API
        const txnid = Date.now().toString(); 
        const hashData = {
            key:process.env.EASEBUZZ_KEY,
            txnid,
            amount:amount.toString(),
            firstname:'YourFirstName',
            email:'youremail@example.com',
            phone:'9999999999',
            productinfo:purpose,
            surl:'http://your-server-url/payments/payment/payment-success',
            furl:'http://your-server-url/payments/payment/payment-failure',
            udf1:'',
            udf2:'',
            udf3:'',
            udf4:'',
            udf5:'',
            udf6:'',
            udf7:'',
            udf8:'',
            udf9:'',
            udf10:''
        };
        hashData.hash = generateHash(hashData);
    

        // Call Easebuzz API to create a payment request
        const easebuzzResponse = await axios.post('https://sandbox.easebuzz.in/payments/initiate', hashData);
    

        // Reponse
        res.json({payment_url:easebuzzResponse.data.payment_url});

    } catch (err) {
        res.status(500).json(err);
    }
});





// Payment success
router.post('/payment/payment-success', async (req, res) => {
    try {

        // Reponse
        res.send('Payment successful');

    } catch (err) {
        res.status(500).json(err);
    }
});





// Payment failure
router.post('/payment/payment-failure', async (req, res) => {
    try {

        // Reponse
        res.send('Payment failed');

    } catch (err) {
        res.status(500).json(err);
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