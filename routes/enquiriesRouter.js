// Imports
import express from 'express';
import Designation from '../models/Designation.js';
import AcademicYear from '../models/AcademicYear.js';
import Enquiry from '../models/Enquiry.js';
import EnquiryNoSetting from '../models/EnquiryNoSetting.js';





// Defining router
const router = express.Router();





// Create enquiry
router.post('/create', async (req, res) => {
    try {

        // Request body
        const {
            visitor_name,
            visitor_address,
            mobile_no,
            student_name,
            class_name
        } = req.body;


        // Active session
        const activeSession = await AcademicYear.findOne({is_active:true});


        // Enquiries length
        const enquiruesLength = await Enquiry.countDocuments();


        // Generating new registration number
        let substringValue;
        if(enquiruesLength < 9){
            substringValue = 0;
        }else if(enquiruesLength >= 9){
            substringValue = 1;
        }else if(enquiruesLength >= 99){
            substringValue = 2;
        }else if(enquiruesLength >= 999){
            substringValue = 3;
        }else if(enquiruesLength >= 9999){
            substringValue = 4;
        }else if(enquiruesLength >= 99999){
            substringValue = 5;
        }else if(enquiruesLength >= 999999){
            substringValue = 6;
        };
        const enquiryNos = await EnquiryNoSetting.find({session:activeSession.year_name});
        const enquiryNo = enquiryNos[0];
        const newEnquiryNo = enquiryNo ? `${enquiryNo?.prefix}${enquiryNo?.lead_zero.substring(substringValue, enquiryNo?.lead_zero?.length - 1)}${enquiruesLength + 1}${enquiryNo?.suffix}` : '';


        // Creating
        const newEnquiry = await Enquiry.create({
            session:activeSession.year_name,
            enquiry_no:newEnquiryNo,
            enquiry_date:new Date(),
            visitor_name,
            visitor_address,
            mobile_no,
            purpose_is_admission:true,
            student_name,
            class_name,
            reason_to_visit:'',
            contact_person:'',
            reference_details:''
        });


        // Response
        res.status(201).json({
            status:'success',
            message:'Enquiry created successfully!',
            enquiry:newEnquiry
        });

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;