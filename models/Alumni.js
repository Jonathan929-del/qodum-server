// Import
import mongoose from 'mongoose';





// Alumni schema
const AlumniSchema = new mongoose.Schema(
        {
            first_name:{type:String, required:true},
            last_name:{type:String},
            email:{type:String},
            mobile:{type:Number},
            year_of_passing:{type:Number},
            dob:{type:Date},
            maritial_status:{type:String},
            profession:{type:String},
            address:{type:String},
            city:{type:String},
            state:{type:String},
            zip_code:{type:Number},
            life_after_graduation:{type:String},
            fondest_memories:{type:String}
        },
        {
            timestamps:true
        }
    );





// Export
const Alumni = mongoose.models.Alumni || mongoose.model('Alumni', AlumniSchema);
export default Alumni;