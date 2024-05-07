// Import
import mongoose from 'mongoose';





// Assignment schema
const AssignmentSchema = new mongoose.Schema(
        {
            subject:{type:String, required:true},
            class_name:{type:String, required:true},
            title:{type:String, required:true},
            assignment_date:{type:Date},
            attachment:{type:String},
            assignment:{type:String},
            is_allow_student_for_multiple_submission:{type:Boolean},
            is_active:{type:Boolean},
            submitted_assignments:{type:Array}
        },
        {
            timestamps:true
        }
    );





// Export
const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
export default Assignment;