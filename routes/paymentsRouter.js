// Imports
import axios from 'axios';
import crypto from 'crypto';
import express from 'express';
import bodyParser from 'body-parser';
import Payment from '../models/Payment.js';
import AcademicYear from '../models/AcademicYear.js';
import FeeEntrySetting from '../models/FeeEntrySetting.js';





// Defining router
const router = express.Router();
router.use(express.urlencoded({extended:true}));
router.use(express.json());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));





// Create payment
router.post('/payment/create', async (req, res) => {
    try {

        // Request body
        const {

            // School data
            school_name,
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
            paymode
    
        } = req.body;


        // Academic Years
        const activeAcademicYear = await AcademicYear.findOne({is_active:true});


        // Generating new payment receipt no.
        const paymentsLength = await Payment.countDocuments();
        const feeEntrySettings = await FeeEntrySetting.find();
        const number = feeEntrySettings[0];
        let substringValue;
        if(paymentsLength < 9){
            substringValue = 0;
        }else if(paymentsLength >= 9){
            substringValue = 1;
        }else if(paymentsLength >= 99){
            substringValue = 2;
        }else if(paymentsLength >= 999){
            substringValue = 3;
        }else if(paymentsLength >= 9999){
            substringValue = 4;
        }else if(paymentsLength >= 99999){
            substringValue = 5;
        }else if(paymentsLength >= 999999){
            substringValue = 6;
        };


        // Creating payment
        await Payment.create({
            // Session
            session:activeAcademicYear.year_name,

            // School data
            school_name,
            receipt_no:number ? `${number?.prefix || ''}${number?.lead_zero?.substring(substringValue, number?.lead_zero?.length - 1) || ''}${paymentsLength + 1}${number?.suffix || ''}` : String(Math.floor(Math.random() * 1000000)),
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
            paymode,
            is_canceled:false,
        });


        // Reponse
        res.status(201).send('Payment created');

    } catch (err) {
        res.status(500).json(err);
    }
});





// Student payments
router.post('/student', async (req, res) => {
    try {

        // Request body
        const {adm_no} = req.body;


        // Payments
        const payments = await Payment.find({adm_no}).sort({received_date:-1});


        // Reponse
        res.status(200).send(payments);

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





// Initiate payment
router.post('/payment/initiate-payment', async (req, res) => {
    try {

        // Request body
        const {txnid, amount, productinfo, firstname, phone, email} = req.body;


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
        if(!txnid || txnid.length === 0){
            res.status(400).send({status:'error', message:'Please enter txnid'});
        }else if(!amount || !containsOnlyNumbers(amount)){
            res.status(400).send({status:'error', message:'Please enter a numeric value for the amount'});
        }else if(!firstname){
            res.status(400).send({status:'error', message:'Please enter a firstname'});
        }else if(!phone || !containsOnlyNumbers(phone) || Math.abs(phone).toString().length !== 10 || typeof phone === 'number'){
            res.status(400).send({status:'error', message:'Please enter a numeric value for the phone number'});
        }else if(!email || !isValidEmail(email)){
            res.status(400).send({status:'error', message:'Please enter a valid email'});
        };


        // Generate hash
        const generateHash = data => {
            const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${process.env.EASEBUZZ_SALT_TEST}`;
            // const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${process.env.EASEBUZZ_SALT}`;
            return crypto.createHash('sha512').update(hashString).digest('hex');
        };


        // Hash data
        const hashData = {
            txnid,
            key:process.env.EASEBUZZ_KEY_TEST,
            // key:process.env.EASEBUZZ_KEY,
            email,
            firstname,
            amount,
            phone,
            productinfo,
            surl:'https://test.com/success',
            furl:'https://test.com/failure'
        };
        hashData.hash = generateHash(hashData);


        // Params for the post request
        const postData = new URLSearchParams(hashData);


        // API call
        try {
            const easebuzzRes = await axios.post('https://testpay.easebuzz.in/payment/initiateLink', postData);
            // const easebuzzRes = await axios.post('https://pay.easebuzz.in/payment/initiateLink', postData);
            res.status(200).send(easebuzzRes.data);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        };

    }catch(err){
        console.log(err);
        res.status(500).send(err);
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
        }else if(!amount || !containsOnlyNumbers(amount)){
            res.status(400).send({status:'error', message:'Please enter a numeric value for the amount'});
        }else if(!name){
            res.status(400).send({status:'error', message:'Please enter a name'});
        }else if(!phone || !containsOnlyNumbers(phone) || Math.abs(phone).toString().length !== 10 || typeof phone === 'number'){
            res.status(400).send({status:'error', message:'Please enter a numeric value for the phone number'});
        }else if(!email || !isValidEmail(email)){
            res.status(400).send({status:'error', message:'Please enter a valid email'});
        };


        // Generate hash
        const generateHash = data => {
            const hashString = `${data.key}|${data.merchant_txn}|${data.name}|${data.email}|${data.phone}|${data.amount}|||||||${process.env.EASEBUZZ_SALT}`;
            return crypto.createHash('sha512').update(hashString).digest('hex');
        };


        // Hash data
        const hashData = {
            merchant_txn,
            key:process.env.EASEBUZZ_KEY,
            email,
            name,
            amount,
            phone
        };
        hashData.hash = generateHash(hashData);


        // API call
        try {
            const easebuzzRes = await axios.post('https://dashboard.easebuzz.in/easycollect/v1/create', hashData);
            res.status(200).send(easebuzzRes.data.data.payment_url || 'error');
        } catch (error) {
            res.status(500).send(error);
        }

    }catch(err){
        res.status(500).send(err);
    }
});





// Check easy pay payment
router.post('/payment/check-easy-pay', async (req, res) => {
    try {

        // Request body
        const {merchant_txn} = req.body;


        // Validations
        if(!merchant_txn || merchant_txn.length === 0){
            res.status(400).send({status:'error', message:'Please enter merchant_txn'});
        };


        // Generate hash
        const generateHash = data => {
            const hashString = `${process.env.EASEBUZZ_KEY_TEST}|${merchant_txn}|${process.env.EASEBUZZ_SALT}`;
            return crypto.createHash('sha512').update(hashString).digest('hex');
        };


        // API Call
        try {
            const url = `https://dashboard.easebuzz.in/easycollect/v1/get?key=${process.env.EASEBUZZ_KEY}&merchant_txn=${merchant_txn}&hash=${generateHash()}`;
            const easebuzzRes = await axios.get(url, {
                headers:{
                  'Accept':'application/json'
                }
            });
            res.status(200).send({
                status:easebuzzRes.data.data.payment_made === 1 ? 'completed' : 'cancelled'
            });
            res.send(easebuzzRes.data);
        } catch (error) {
            res.status(500).send(error);
        }

    }catch(err){
        res.status(500).send(err);
    }
});





// Insta collect link
router.post('/payment/insta-collect', async (req, res) => {
    try {

        // Request body
        const {unique_request_number, amount, customer_name, customer_phone} = req.body;


        // Contains only numbers function
        const containsOnlyNumbers = str => {
            return /^\d+$/.test(str);
        };


        // Validations
        if(!unique_request_number || unique_request_number.length === 0){
            res.status(400).send({success:false, message:'Please enter a request number'});
        }else if(!amount || !containsOnlyNumbers(amount)){
            res.status(400).send({success:false, message:'Please enter a numeric value for the amount'});
        }else if(!customer_name){
            res.status(400).send({success:false, message:'Please enter a customer name'});
        }else if(!customer_phone || !containsOnlyNumbers(customer_phone) || Math.abs(customer_phone).toString().length !== 10 || typeof customer_phone === 'number'){
            res.status(400).send({success:false, message:'Please enter a numeric value for the customer phone number'});
        };


        // Constants
        const key = process.env.NEW_EASEBUZZ_KEY;
        const salt = process.env.NEW_EASEBUZZ_SALT;
        const per_transaction_amount = amount;
        const udf1 = 'customValue1'; 
        const udf2 = 'customValue2'; 
        const udf3 = 'customValue3'; 
        const udf4 = 'customValue4'; 
        const udf5 = 'customValue5';


        // Hash code
        const hashString = `${key}|${unique_request_number}|${amount}|${per_transaction_amount}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${salt}`;
        const authorizationHash = crypto.createHash('sha512').update(hashString).digest('hex');


        // Request payload
        const data = {
            key,
            unique_request_number,
            amount,
            per_transaction_amount,
            customer_name,
            customer_phone,
            allowed_collection_modes:['upi'],
            udf1,
            udf2,
            udf3,
            udf4,
            udf5
        };


        // Headers
        const headers = {
            'Content-Type':'application/json',
            'Authorization':authorizationHash,
            'WIRE-API-KEY':key,
        };


        // Make the POST request
        const response = await axios.post('https://wire.easebuzz.in/api/v1/insta-collect/order/create/', data, {headers});
        if(!response.data.success){
            res.status(200).send(response.data);
        }else if(response.data.success){
            res.status(200).send({success:true, payment_url:response.data.data.transaction_order.virtual_account.upi_qrcode_url, order_id:response.data.data.transaction_order.id});
        };

    } catch (error) {
        res.status(500).send(error);
    }
});





// Insta collect status
router.post('/payment/insta-collect-status', async (req, res) => {
    try {

        // Request body
        const {orderId} = req.body;


        // Validate if orderId is provided
        if(!orderId){
            return res.status(400).json({
                success:false,
                error:'Order ID (orderId) is required',
            });
        };


        // Merchant key and salt
        const MERCHANT_KEY = process.env.NEW_EASEBUZZ_KEY;
        const MERCHANT_SALT = process.env.NEW_EASEBUZZ_SALT;


        // Hash string
        const hashString = `${MERCHANT_KEY}|${orderId}|${MERCHANT_SALT}`;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');


        // URL for the GET request
        const requestUrl = `https://wire.easebuzz.in/api/v1/insta-collect/order/${orderId}/?key=${MERCHANT_KEY}`;
    

        // Request
        const response = await axios.get(
            requestUrl,
            {
                headers: {
                    'Authorization':hash,
                    'WIRE-API-KEY':MERCHANT_KEY,
                    'Accept':'application/json'
                }
            }
        );


        // Handling the response
        if(response.data.success){
            res.status(200).json({success:true, status:response.data.data.transaction_order.status});
        }else if(!response.data.success){
            res.status(200).json({success:false, error:'Order not found or invalid parameters'});
        };

    } catch (error) {
        console.error('Error retrieving order:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while retrieving the order',
        });
    }
});





// Export
export default router;