// Imports
import axios from 'axios';
import express from 'express';
import bcrypt from 'bcryptjs';
import signToken from '../utils/jwt.js'
import AppStudent from '../models/AppStudent.js';
import AdmittedStudent from '../models/AdmittedStudent.js';
import {validateAdmNo, validateLoginInputs, validateRegisterInputs} from '../utils/validators.js';





// Defining router
const router = express.Router();





// The OTP
let otp;
let student;
let isOTPVerified = false;





// Sending OTP as sms
router.post('/send-sms', async (req, res) => {
    try {
        // Textlocal API endpoint
        const url = 'https://api.textlocal.in/send/';

        // Textlocal API Key
        const apiKey = 'kAiF9xTqUTA-NxDC7acWdsdtBOtpUwQ3SxulB9i17m';

        // Message details
        const sender = 'iTStrt';
        const numbers = ['01207777636'];
        const message = 'This is a test message from Textlocal';

        // Textlocal API parameters
        const params = {
            apiKey,
            numbers,
            message,
            sender
        };

        // Send SMS using axios
        const response = await axios.post(url, params);
        console.log(response.data.errors);

        // Check if SMS was sent successfully
        if (response.data.status === 'success') {
            res.status(200).send('SMS sent successfully');
        } else {
            res.status(500).send('Failed to send SMS');
        }
    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).send('Error sending SMS');
    }
});





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
        if(!otp) res.send('OTP timeout');
        const isOtpsEqual = the_otp === otp;
        if(!the_otp) res.send('OTP not provided');
        if(!isOtpsEqual) res.send("OTPs don't match");


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
            res.status(400).send('OTP timeout');
            return;
        };
        if(!isOTPVerified){
            res.status(400).send('OTP not verified');
            return;
        };


        // Validations
        const {password, confirm_password} = req.body;
        const {errors, valid} = validateRegisterInputs(password, confirm_password);
        if(!valid) res.status(400).json(errors);
        
        
        // Registering the student
        const hashedPassword = bcrypt.hashSync(password);
        const newStudent = await AppStudent.create({
            adm_no:student.student.adm_no,
            password:hashedPassword,
            
            student:{
                name:student.student.name,
                class_name:student.student.class_name,
                image:student.student.image,
                background_image:'',
                doa:student.student.doa,
                dob:student.student.dob,
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





// login student
router.post('/student/login', async (req, res) => {
    try {

        // Validations
        const {adm_no, password} = req.body;
        const {errors, valid} = validateLoginInputs(adm_no, password);
        const searchedStudent = await AppStudent.findOne({adm_no});
        if(!valid) res.status(400).json(errors);
        if(!searchedStudent){
            errors.adm_no = 'Student not found';
            res.status(400).json(errors);
        };
        const match = bcrypt.compareSync(password, searchedStudent.password);
        if(!match){
            errors.password = 'Wrong credentials';
            res.status(400).json(errors);
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





// Export
export default router;