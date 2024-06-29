// Imports
import axios from 'axios';
import crypto from 'crypto';
import express from 'express';
import Payment from '../models/Payment.js';





// Defining router
const router = express.Router();





// Send payment
router.post('/payment/initiate-payment', async (req, res) => {
    try {

        // Request body
        const {txnid, amount, productinfo, firstname, phone, email} = req.body;


        // Generate hash
        const generateHash = data => {
            const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${process.env.EASEBUZZ_SALT}`;
            return crypto.createHash('sha512').update(hashString).digest('hex');
        };


        // Hash data
        const hashData = {
            key:process.env.EASEBUZZ_KEY,
            txnid,
            amount,
            productinfo,
            firstname,
            phone,
            email,
            surl:'http://localhost:5000/payments/payment/success',
            furl:'http://localhost:5000/payments/payment/failure',
        };
        hashData.hash = generateHash(hashData);



        // Convert JSON object to url encoded form
        const jsonToUrlEncoded = json => {
            return Object.keys(json)
              .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
              .join('&');
        };


        // API call
        const easebuzzRes = await axios.post('https://testpay.easebuzz.in/payment/initiateLink', jsonToUrlEncoded(hashData));


        // Response
        res.status(200).send(easebuzzRes.data);

    } catch (err) {
        res.status(500).send(err.message);
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





// Last payment
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