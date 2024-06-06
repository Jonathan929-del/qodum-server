// Imports
import express from 'express';
import bcrypt from 'bcryptjs';
import AppStudent from '../models/AppStudent.js';
import signToken from '../utils/signToken/studentJwt.js';
import AdmittedStudent from '../models/AdmittedStudent.js';
import {validateAdmNo, validateLoginInputs, validateRegisterInputs} from '../validations/auth.js';





// Defining router
const router = express.Router();





// The OTP
let otp;
let student;
let isOTPVerified = false;





// Fetching student by adm no and sending OTP to the registered phone number
router.post('/student/send-otp', async (req, res) => {
    try {

        // Admission number
        const {adm_no} = req.body;


        // Admission number validation and fetching student
        if(!adm_no) {
            res.send('Admission number is required');
            return;
        };
        const studentRes = await AdmittedStudent.findOne({'student.adm_no':adm_no});
        if(!studentRes){
            res.send('No students found with this admission number');
            return;
        };


        // Validations
        const existingUser = await AppStudent.findOne({adm_no});
        const {errors, valid} = validateAdmNo(adm_no);
        if(!valid || existingUser || !studentRes){
            if(existingUser) errors.student = 'Student already registered';
            otp = '';
            student = {};
            res.json(errors);
            return;
        };


        // Sending SMS
        const generateOTP = 111111;
        // const generateOTP = Math.random().toString().substr(2, 6);


        // Setting OTP
        otp = generateOTP;
        student = studentRes;


        // OTP timeount
        setTimeout(() => {
            otp = '';
            student = '';
            isOTPVerified = false;
        }, 3600000);


        // Response
        res.status(200).send(studentRes);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Check OTP
router.post('/student/check-otp', async (req, res) => {
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





// Register student
router.post('/student/register', async (req, res) => {
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
        
        
        // Registering the student
        const hashedPassword = bcrypt.hashSync(password);
        const newStudent = await AppStudent.create({
            type:'Student',
            adm_no:student.student.adm_no,
            password:hashedPassword,
            
            student:{
                name:student.student.name,
                class_name:student.student.class,
                image:student.student.image,
                background_image:'',
                doa:student.student.doa,
                dob:student.student.dob,
                email:student.student.email,
                pen_no:student.student.pen_no,
                blood_group:student.student.blood_group,
                house:student.student.house,
                address:student.student.h_no_and_streets,
                contact_person_mobile:student.student.contact_person_mobile,
                roll_no:student.student.roll_no,
                aadhar_card_no:student.student.aadhar_card_no
            },
            
            parents:{
                father:{
                    father_name:student.parents.father.father_name,
                },
                mother:{
                    mother_name:student.parents.mother.mother_name,
                }
            }
        });
        
        
        // Resetting OTP
        otp = '';
        student = '';
        isOTPVerified = false;
        
        
        // Generating token
        const token = signToken(newStudent);
        res.status(201).json({
            ...newStudent._doc,
            token
        });

    } catch (err) {
        res.status(500).json(err);
    }
});





// Login student
router.post('/student/login', async (req, res) => {
    try {

        // Validations
        const {adm_no, password} = req.body;
        const {errors, valid} = validateLoginInputs(adm_no, password);
        const searchedStudent = await AppStudent.findOne({adm_no});
        if(!valid) {
            res.json(errors);
            return;
        };
        if(!searchedStudent){
            errors.adm_no = 'Wrong credentials.';
            res.json(errors);
            return;
        };
        const match = bcrypt.compareSync(password, searchedStudent.password);
        if(!match){
            errors.adm_no = 'Wrong credentials.';
            res.json(errors);
            return;
        };

;        
        
        // loging the student
        const token = signToken(searchedStudent);
        res.status(200).json({
            ...searchedStudent._doc,
            token
        });


    } catch (err) {
        res.status(500).json(err);
    }
});





// Fetch student fee detalis
router.post('/student/fee', async (req, res) => {
    try {

        // Validations
        const {adm_no} = req.body;


        // Student fee details
        const student = await AdmittedStudent.findOne({'student.adm_no':adm_no});
        const feeDetails = student.affiliated_heads;


        // Response
        res.status(200).json(feeDetails);


    } catch (err) {
        res.status(500).json(err);
    }
});





// Modify student fee heads
router.post('/student/fee/pay', async (req, res) => {
    try {

        // Validations
        const {adm_no, new_heads} = req.body;


        // Student fee details
        await AdmittedStudent.findOneAndUpdate({'student.adm_no':adm_no}, {'affiliated_heads.heads':new_heads});


        // Response
        res.status(200).json('Payment done');

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;