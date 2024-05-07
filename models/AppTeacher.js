// Import
import mongoose from 'mongoose';





// App teacher schema
const AppTeacherSchema = new mongoose.Schema(
        {
            type:{type:String},
            background_image:{type:String},
            image:{type:String},
            name:{type:String},
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
            email:{type:Number}
        },
        {
            timestamps:true
        }
    );





// Export
const AppTeacher = mongoose.models.AppTeacher || mongoose.model('AppTeacher', AppTeacherSchema);
export default AppTeacher;