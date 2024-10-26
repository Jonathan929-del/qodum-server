// Import
import mongoose from 'mongoose';





// Admission State Schema
const AdmissionStateSchema = new mongoose.Schema(
    {
        session:{type:String, required:true},
        is_staff_admission_opened:{type:Boolean},
        is_students_admission_opened:{type:Boolean}
    },
    {
        timestamps:true
    }
);





// Export
const AdmissionState = mongoose.models.AdmissionState || mongoose.model('AdmissionState', AdmissionStateSchema);
export default AdmissionState;