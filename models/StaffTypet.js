// Import
import mongoose from 'mongoose';





// Staff type schema
const StaffTypeSchema = new mongoose.Schema(
        {
            session:{type:String, required:true},
            staff_type:{type:String, required:true},
            is_hourly_paid:{type:Boolean},
            show_on_ecare:{type:Boolean}
        },
        {
            timestamps:true
        }
    );





// Export
const StaffType = mongoose.models.StaffType || mongoose.model('StaffType', StaffTypeSchema);
export default StaffType;