// Imports
import express from 'express';
import AcademicYear from '../models/AcademicYear.js';
import StaffApplication from '../models/StaffApplication.js';
import {validateCandidateApplication} from '../validations/auth.js';
import StaffAdmissionNumber from '../models/StaffAdmissionNumber.js';





// Defining router
const router = express.Router();





// Student candidate application
router.post('/staff-application/candidate-application', async (req, res) => {
    try {

        // Request body
        const {
            post,
            profile_picture,
            first_name,
            middle_name,
            last_name,
            email,
            mobile,
            address,
            father_or_spouse_name,
            staff_type,
            designation,
            department,
            gender,
            dob,
        } = req.body;


        // Validations
        const {valid, errors} = validateCandidateApplication({
            post,
            first_name,
            email,
            mobile,
            father_or_spouse_name,
            staff_type,
            designation,
            department,
            gender,
            address
        });
        if(!valid){
            errors.status = 'failure';
            res.send(errors);
            return;
        };


        // Academic Years
        const activeAcademicYear = await AcademicYear.findOne({is_active:true});


        // Staff count
        const staffCount = await StaffApplication.countDocuments();
        let substringValue;
        if(staffCount < 9){
            substringValue = 0;
        }else if(staffCount >= 9){
            substringValue = 1;
        }else if(staffCount >= 99){
            substringValue = 2;
        }else if(staffCount >= 999){
            substringValue = 3;
        }else if(staffCount >= 9999){
            substringValue = 4;
        }else if(staffCount >= 99999){
            substringValue = 5;
        }else if(staffCount >= 999999){
            substringValue = 6;
        };
        const admissionNumber = await StaffAdmissionNumber.findOne({setting_type:'Applicant Reg. No.'});
        const newRegNo = admissionNumber ? `${admissionNumber?.prefix}${admissionNumber?.lead_zero.substring(substringValue, admissionNumber?.lead_zero?.length - 1)}${staffCount + 1}${admissionNumber?.suffix}` : '';


        // Registering the student
        await StaffApplication.create({

            // Session
            session:activeAcademicYear.year_name,

            // Is up for admission
            is_up_for_admission:false,

            // Staff registration
            staff_registration:{
                post,
                reg_no:newRegNo || Math.floor(Math.random() * 100000),
                employee_code:newRegNo || Math.floor(Math.random() * 100000),
                approved_teacher:'',
                teacher_id:'',
                cbse_code:'',
                first_name_title:'Mr.',
                first_name,
                middle_name:middle_name,
                last_name:last_name,
                gender,
                email,
                alternate_email:'',
                phone:0,
                mobile,
                whatsapp_mobile:0,
                emergency_mobile:0,
                wing:'',
                is_active:true,
                profile_picture,
                maritial_status:'Married',
                qualification:'',
                date_of_birth:dob,
                date_of_anniversary:new Date(),
                date_of_joining:new Date(),
                date_of_retire:new Date(),
                date_of_retire_is_extend:false,
                permenant_address:'',
                current_address:address,
                father_or_spouse_name,
                father_or_spouse_mobile:0,
                father_or_spouse_relation:'',
                blood_group:'',
                staff_type,
                designation,
                department,
                religion:'',
                aadhar_card_no:0
            },


            // Staff educational details
            staff_educational_details:[],


            // Staff experience details
            staff_experience_details:[],


            // Staff document details
            staff_document_details:[]

        });


        // Return
        res.status(201).send({
            status:'success',
            message:'Successfull registration'
        });

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;