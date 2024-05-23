// Import
import mongoose from 'mongoose';





// Assignment schema
const AssignmentSchema = new mongoose.Schema(
        {
            creator:{type:String},
            creator_image:{type:String},
            subject:{type:String, required:true},
            class_name:{type:String, required:true},
            title:{type:String, required:true},
            assignment_date:{type:Date},
            to_be_submitted_on:{type:Date},
            attachment:{type:String},
            description:{type:String},
            is_allow_student_for_multiple_submission:{type:Boolean},
            is_active:{type:Boolean},
            submitted_assignments:[{
                student:{
                    adm_no:{type:String},
                    name:{type:String},
                    roll_no:{type:String}
                },
                answer:{type:String},
                attachment:{type:String},
                created_at:{type:Date},
                feedback:{
                    feedback:{type:String},
                    grade:{type:String}
                }
            }]
        },
        {
            timestamps:true
        }
    );





// Export
const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
export default Assignment;