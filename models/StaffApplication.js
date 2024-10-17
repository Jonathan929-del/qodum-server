// Import
import mongoose from 'mongoose';





// Staff application schema
const StaffApplicationSchema = new mongoose.Schema(
    {

        // Session
        session:{type:String, required:true},

        // Is up for admission
        is_up_for_admission:{type:Boolean},

        // Staff registration
        staff_registration:{
            pref_no:{type:Number, required:true, unique:true},
            first_name_title:{type:String, required:true},
            first_name:{type:String, required:true},
            middle_name:{type:String},
            last_name:{type:String},
            gender:{type:String},
            email:{type:String},
            alternate_email:{type:String},
            phone:{type:Number},
            mobile:{type:Number, required:true},
            alternate_mobile:{type:Number},
            emergency_mobile:{type:Number},
            wing:{type:String},
            is_active:{type:Boolean},
            profile_picture:{type:String},
            maritial_status:{type:String},
            qualification:{type:String},
            date_of_birth:{type:Date, required:true},
            date_of_anniversary:{type:Date},
            date_of_joining:{type:Date},
            date_of_retire:{type:Date},
            date_of_retire_is_extend:{type:Boolean},
            address:{type:String},
            current_address:{type:String},
            father_or_spouse_name:{type:String, required:true},
            father_or_spouse_mobile:{type:Number},
            father_or_spouse_relation:{type:String},
            blood_group:{type:String},
            staff_type:{type:String, required:true},
            designation:{type:String, required:true},
            department:{type:String, required:true},
            religion:{type:String},
            aadhar_card_no:{type:Number},
        },


        // Staff educational details
        staff_educational_details:{Array},


        // Staff document details
        staff_document_details:{type:Array}

    },
    {
        timestamps:true
    }
);





// Export
export default mongoose.model('StaffApplication', StaffApplicationSchema);