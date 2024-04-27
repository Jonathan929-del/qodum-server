// Imports
import mongoose from 'mongoose';





// App student schema
const AppStudentSchema = mongoose.Schema({
    // App student data
    adm_no:{type:String, unique:true, required:true},
    password:{type:String, required:true},
    
    // Student Data
    student:{
        name:{type:String, required:true},
        class_name:{type:String},
        image:{type:String},
        background_image:{type:String},
        doa:{type:Date},
        dob:{type:Date},
        pen_no:{type:Number},
        blood_group:{type:String},
        house:{type:String},
        address:{type:String},
        contact_person_mobile:{type:String},
        roll_no:{type:Number},
        aadhar_card_no:{type:Number}
    },
    
    // Parents details
    parents:{
        father:{
            father_name:{type:String},
        },
        mother:{
            mother_name:{type:String},
        }
    }
});





// Export
export default mongoose.model('AppStudent', AppStudentSchema);