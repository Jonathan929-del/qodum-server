// Imports
import axios from 'axios';
import crypto from 'crypto';
import express from 'express';
import bodyParser from 'body-parser';
import Payment from '../models/Payment.js';





// Defining router
const router = express.Router();
router.use(express.urlencoded({extended:true}));
router.use(express.json());
router.use(bodyParser.json());





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





// Easy pay link
router.post('/payment/easy-pay', async (req, res) => {
    try {

        // Request body
        const {merchant_txn, amount, name, phone, email} = req.body;


        // Contains only numbers function
        const containsOnlyNumbers = str => {
            return /^\d+$/.test(str);
        };


        // Is email valid
        const isValidEmail = email => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        };


        // Validations
        if(!merchant_txn || merchant_txn.length === 0){
            res.status(400).send({status:'error', message:'Please enter merchant_txn'});
        }else if(!amount ||  !containsOnlyNumbers(amount)){
            res.status(400).send({status:'error', message:'Please enter a numeric value for the amount'});
        }else if(!name){
            res.status(400).send({status:'error', message:'Please enter a name'});
        }else if(!phone || !containsOnlyNumbers(phone) || Math.abs(phone).toString().length !== 10){
            res.status(400).send({status:'error', message:'Please enter a numeric value for the phone number'});
        }else if(!email || !isValidEmail(email)){
            res.status(400).send({status:'error', message:'Please enter a valid email'});
        };


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
            res.status(200).send(easebuzzRes.data.data.payment_url || 'error');
        } catch (error) {
            res.status(500).send(error);
        }

    }catch(err){
        res.status(500).send(err);
    }
});





router.post('/payment/status', async (req, res) => {
    try {

        // Request body
        const {txnId} = req.body;


        // Empty transaction id validation
        if (!txnId) {
            return res.status(400).json({
                success:false,
                error:'Transaction ID (txn_id) is required',
            });
        };


        // Merchnat key and salt
        const MERCHANT_KEY = '2PBP7IABZ2';
        const MERCHANT_SALT = 'DAH88E3UWQ';


        // Hash string
        const hashString = `${MERCHANT_KEY}|${txnId}|${MERCHANT_SALT}`;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');


        // Params for the post request
        const postData = new URLSearchParams({
            key:MERCHANT_KEY,
            txnid:txnId,
            hash:hash
        });


        // Post request
        const response = await axios.post(
            'https://testdashboard.easebuzz.in/transaction/v2.1/retrieve',
            postData.toString(),
            {
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded',
                }
            }
        );
        
        
        // Response
        if(response?.data?.msg === 'Transaction not found'){
            res.status(200).send('Transaction not found');
        }else if(response?.data?.msg.length > 0 && response?.data?.msg[0]?.status === 'success'){
            res.status(200).send({
                status:'success',
                amount:response?.data?.msg[0]?.amount
            });
        }else if(response?.data?.msg.length > 0 && response?.data?.msg[0]?.status === 'failure'){
            res.status(200).send({
                status:'failure'
            });
        };

    }catch(error){
        res.status(500).json(error);
    };
});





// API route to accept webhook data
router.post('/webhook', (req, res) => {
    try {

        const webhookData = req.body;
        console.log('Received webhook data:', webhookData);
    
        // Verify the hash
        const isHashValid = verifyHash(webhookData, webhookData.hash);
    
        if(isHashValid){
            res.status(200).send('Webhook received and hash verified');
        }else{
            console.error('Invalid hash!');
            res.status(400).send('Invalid hash');
        };

    } catch (err) {
        console.error('Error processing webhook:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





// Export
export default router;