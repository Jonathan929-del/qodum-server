// Imports
import axios from 'axios';
import crypto from 'crypto';
import express from 'express';
import Payment from '../models/Payment.js';





// Defining router
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());





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





// // Easy pay link
// router.post('/payment/easy-pay', async (req, res) => {
//     try {

//         // Request body
//         const {merchant_txn, amount, name, phone, email} = req.body;


//         // Generate hash
//         const generateHash = data => {
//             const hashString = `${data.key}|${data.merchant_txn}|${data.name}|${data.email}|${data.phone}|${data.amount}|||||||${process.env.EASEBUZZ_SALT}`;
//             return crypto.createHash('sha512').update(hashString).digest('hex');
//         };


//         // Hash data
//         const hashData = {
//             merchant_txn,
//             key:process.env.EASEBUZZ_KEY,
//             email,
//             name,
//             amount,
//             phone
//         };
//         hashData.hash = generateHash(hashData);



//         // Convert JSON object to url encoded form
//         const jsonToUrlEncoded = json => {
//             return Object.keys(json)
//               .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
//               .join('&');
//         };


//         // API call
//         const easebuzzRes = await axios.post('https://dashboard.easebuzz.in/easycollect/v1/create', jsonToUrlEncoded(hashData));


//         // Response
//         res.status(200).send(easebuzzRes.data.data.payment_url || 'error');

//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });
// Easy pay link
router.post('/payment/easy-pay', async (req, res) => {
    try {

        // Request body
        const {merchant_txn, amount, name, phone, email} = req.body;


        // Generate hash
        const generateHash = data => {
            const hashString = `${data.key}|${data.merchant_txn}|${data.name}|${data.email}|${data.phone}|${data.amount}|||||||${process.env.EASEBUZZ_SALT_TEST}`;
            return crypto.createHash('sha512').update(hashString).digest('hex');
        };


        // Hash data
        const hashData = {
            merchant_txn,
            key:process.env.EASEBUZZ_KEY_TEST,
            email,
            name,
            amount,
            phone
        };
        hashData.hash = generateHash(hashData);


        // API call
        try {
            const easebuzzRes = await axios.post('https://testdashboard.easebuzz.in/easycollect/v1/create', hashData);
            // Response
            res.status(200).send(easebuzzRes.data.data.payment_url || 'error');
        } catch (error) {
            // console.log(error);
            res.status(500).send(err.message);
        }



    } catch (err) {
        res.status(500).send(err.message);
    }
});





// Check payment status
router.post('/payment/status', async (req, res) => {
    try {

        // Request body
        const {txnid} = req.body;


        // Generate hash
        const generateHash = data => {
            const hashString = `${data.key}|${data.txnid}|${process.env.EASEBUZZ_SALT_TEST}`;
            return crypto.createHash('sha512').update(hashString).digest('hex');
        };


        // Hash data
        const hashData = {
            txnid,
            key:process.env.EASEBUZZ_KEY_TEST

        };
        hashData.hash = generateHash(hashData);



        // Convert JSON object to url encoded form
        const jsonToUrlEncoded = json => {
            return Object.keys(json)
              .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
              .join('&');
        };


        // API call
        const easebuzzRes = await axios.post('https://testdashboard.easebuzz.in/transaction/v2.1/retrieve', jsonToUrlEncoded(hashData));


        // Response
        res.status(200).send(easebuzzRes.data || 'error');

    } catch (err) {
        res.status(500).send(err.message);
    }
});
// // Check payment status
// router.post('/payment/status', async (req, res) => {
//     try {

//         // Request body
//         const {merchant_txn} = req.body;


//         // Generate hash
//         const generateHash = data => {
//             const hashString = `${data.key}|${data.merchant_txn}|${process.env.EASEBUZZ_SALT}`;
//             return crypto.createHash('sha512').update(hashString).digest('hex');
//         };


//         // Hash data
//         const hashData = {
//             merchant_txn,
//             key:process.env.EASEBUZZ_KEY,

//         };
//         hashData.hash = generateHash(hashData);



//         // Convert JSON object to url encoded form
//         const jsonToUrlEncoded = json => {
//             return Object.keys(json)
//               .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
//               .join('&');
//         };


//         // API call
//         // const easebuzzRes = await axios.post('https://dashboard.easebuzz.in/easycollect/v1/get', jsonToUrlEncoded(hashData));
//         const easebuzzRes = await axios.post('https://testdashboard.easebuzz.in/easycollect/v1/get', jsonToUrlEncoded(hashData));


//         // Response
//         res.status(200).send(easebuzzRes.data || 'error');

//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });





// API route to accept webhook data
router.post('/webhook', (req, res) => {
    try {
        
        // Webhook data
        const webhookData = req.body;
      
        // Data
        console.log('Received webhook data:', webhookData);
      
        // Response
        res.status(200).send(webhookData);

    }catch(err){
        res.status(500).send(err);  
    };
});





// Export
export default router;