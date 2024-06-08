// Imports
import express from 'express';
import bcrypt from 'bcryptjs';
import Teacher from '../models/Teacher.js';
import AppTeacher from '../models/AppTeacher.js';
import signToken from '../utils/signToken/teacherJwt.js'
import {validateAdmNo, validateLoginInputs, validateRegisterInputs} from '../validations/auth.js';





// Defining router
const router = express.Router();





// The OTP
let otp;
let teacher;
let isOTPVerified = false;





// Fetching teacher by adm no and sending OTP to the registered phone number
router.post('/teacher/send-otp', async (req, res) => {
    try {

        // Admission number
        const {adm_no} = req.body;


        // Admission number validation and fetching teacher
        if(!adm_no) {
            res.send('Admission number is required');
            return;
        };
        const teacherRes = await Teacher.findOne({adm_no});
        if(!teacherRes){
            res.send('No teachers found with this admission number');
            return;
        };


        // Validations
        const existingUser = await AppTeacher.findOne({adm_no});
        const {errors, valid} = validateAdmNo(adm_no);
        if(!valid || existingUser || !teacherRes){
            if(existingUser) errors.adm_no = 'Teacher already registered';
            otp = '';
            teacher = {};
            res.json(errors);
            return;
        };


        // Sending SMS
        const generateOTP = 111111;
        // const generateOTP = Math.random().toString().substr(2, 6);


        // Setting OTP
        otp = generateOTP;
        teacher = teacherRes;


        // OTP timeount
        setTimeout(() => {
            otp = '';
            teacher = '';
            isOTPVerified = false;
        }, 3600000);


        // Response
        res.status(200).send(teacherRes);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Check OTP
router.post('/teacher/check-otp', async (req, res) => {
    try {

        // Request body
        const {the_otp} = req.body;
        
        
        // Validations
        if(!otp){
            res.send('OTP timeout');
            return;
        };
        const isOtpsEqual = the_otp === otp;
        if(!the_otp){
            res.send('OTP not provided');
            return;
        };
        if(!isOtpsEqual){
            res.send("OTPs don't match");
            return;
        };


        // Setting is otp to be verified
        isOTPVerified = true;


        // Response
        res.status(201).send('Checked successfully');


    } catch (err) {
        res.status(500).json(err.message);
    }
});





// Register teacher
router.post('/teacher/register', async (req, res) => {
    try {

        // Checking if OTP has expired
        if(!otp){
            res.send('OTP timeout');
            return;
        };
        if(!isOTPVerified){
            res.send('OTP not verified');
            return;
        };


        // Validations
        const {password, confirm_password} = req.body;
        const {errors, valid} = validateRegisterInputs(password, confirm_password);
        if(!valid){
            res.send(errors);
            return;
        };
        
        
        // Registering the teacher
        const hashedPassword = bcrypt.hashSync(password);
        const newTeacher = await AppTeacher.create({
            type:'Teacher',
            background_image:'',
            image:teacher.image,
            name:teacher.name,
            class_name:teacher.class_name,
            adm_no:teacher.adm_no,
            password:hashedPassword,
            mobile:teacher.mobile,
            dob:teacher.dob,
            doj:teacher.doj,
            marital_status:teacher.marital_status,
            father_name:teacher.father_name,
            doa:teacher.doa,
            gender:teacher.gender,
            nationality:teacher.nationality,
            religion:teacher.religion,
            qualification:teacher.qualification,
            address:teacher.address,
            permenant_address:teacher.permenant_address,
            aadhar_card_no:teacher.aadhar_card_no,
            pan_card_no:teacher.pan_card_no,
            bank_account_no:teacher.bank_account_no,
            uan_number:teacher.uan_number,
            contact_nos:teacher.contact_nos,
            father_contact_no:teacher.father_contact_no,
            email:teacher.email,
            alternate_email:teacher.alternate_email
        });
        
        
        // Resetting OTP
        otp = '';
        teacher = '';
        isOTPVerified = false;
        
        
        // Generating token
        const token = signToken(newTeacher);
        res.status(201).json({
            ...newTeacher._doc,
            token
        });




    } catch (err) {
        res.status(500).json(err);
    }
});





// login teacher
router.post('/teacher/login', async (req, res) => {
    try {

        // Validations
        const {adm_no, password} = req.body;
        const {errors, valid} = validateLoginInputs(adm_no, password);
        const searchedTeacher = await AppTeacher.findOne({adm_no});
        if(!valid) {
            res.json(errors);
            return;
        };
        if(!searchedTeacher){
            errors.adm_no = 'Wrong credentials.';
            res.json(errors);
            return;
        };
        const match = bcrypt.compareSync(password, searchedTeacher.password);
        if(!match){
            errors.adm_no = 'Wrong credentials.';
            res.json(errors);
            return;
        };


        // loging the teacher
        const token = signToken(searchedTeacher);
        res.status(200).json({
            ...searchedTeacher._doc,
            token
        });


    } catch (err) {
        res.status(500).json(err);
    }
});





// Fetch teachers admission numbers
router.get('/adm-nos', async (req, res) => {
    try {

        // Teachers admission numbers
        const teachersAdmNos = await AppTeacher.find({}, {adm_no:1, name:1, image:1});


        // Response
        res.status(200).json(teachersAdmNos);


    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;