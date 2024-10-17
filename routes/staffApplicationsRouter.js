// Imports
import express from 'express';
import AcademicYear from '../models/AcademicYear.js';
import StaffApplication from '../models/StaffApplication.js';
import {validateCandidateApplication} from '../validations/auth.js';
import Staff from '../models/Staff.js';





// Defining router
const router = express.Router();





// Student candidate application
router.post('/staff-application/candidate-application', async (req, res) => {
    try {

        // Request body
        const {
            first_name,
            middle_name,
            last_name,
            email,
            mobile,
            father_or_spouse_name,
            staff_type,
            designation,
            department,
            gender,
            dob,
            address
        } = req.body;


        // Validations
        const {valid, errors} = validateCandidateApplication({
            first_name,
            middle_name,
            last_name,
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
        const staffCount = await Staff.countDocuments();


        // Registering the student
        await StaffApplication.create({

            // Session
            session:activeAcademicYear.year_name,

            // Is up for admission
            is_up_for_admission:false,

            // Staff registration
            staff_registration:{
                pref_no:staffCount + 1,
                first_name_title:gender === 'Male' ? 'Mr.' : 'Mrs.',
                first_name:first_name,
                middle_name,
                last_name,
                gender,
                email:'',
                alternate_email:'',
                phone:'',
                mobile,
                alternate_mobile:0,
                emergency_mobile:0,
                wing:'',
                is_active:true,
                profile_picture:'',
                maritial_status:'Married',
                qualification:'',
                date_of_birth:dob || new Date(),
                date_of_anniversary:new Date(),
                date_of_joining:new Date(),
                date_of_retire:new Date(),
                date_of_retire_is_extend:false,
                address,
                current_address:'',
                father_or_spouse_name:father_or_spouse_name,
                father_or_spouse_mobile:0,
                father_or_spouse_relation:'',
                blood_group:'',
                staff_type,
                designation,
                department,
                religion:'',
                aadhar_card_no:0,
            },


            // Staff educational details
            staff_educational_details:[],


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