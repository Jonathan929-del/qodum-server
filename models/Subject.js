// Import
import mongoose from 'mongoose';





// Subject schema
const SubjectSchema = new mongoose.Schema(
        {
            subject_name:{type:String, required:true, unique:true},
            available_seats:{type:Number},
            is_university:{type:Boolean}
        },
        {
            timestamps:true
        }
    );





// Export
const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
export default Subject;