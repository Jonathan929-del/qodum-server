// Import
import mongoose from 'mongoose';





// Teacher schema
const TeacherSchema = new mongoose.Schema(
        {
            type:{type:String},
            background_image:{type:String},
            image:{type:String},
            name:{type:String},
            class_name:{type:String},
            adm_no:{type:String, required:true, unique:true},
            password:{type:String, required:true},
            mobile:{type:Number},
            dob:{type:Date},
            doj:{type:Date},
            marital_status:{type:String},
            father_name:{type:String},
            doa:{type:Date},
            gender:{type:String},
            nationality:{type:String},
            religion:{type:String},
            qualification:{type:String},
            address:{type:String},
            permenant_address:{type:String},
            aadhar_card_no:{type:Number},
            pan_card_no:{type:Number},
            bank_account_no:{type:Number},
            uan_number:{type:Number},
            contact_nos:{type:Array},
            father_contact_no:{type:Number},
            email:{type:String},
            alternate_email:{type:String}
        },
        {
            timestamps:true
        }
    );





// Export
const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);
export default Teacher;