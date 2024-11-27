// Import
import mongoose from 'mongoose';





// Fee entry setting Schema
const FeeEntrySettingSchema = new mongoose.Schema(
    {
        prefix:{type:String},
        lead_zero:{type:String},
        receipt_no_start:{type:String},
        suffix:{type:String},
        generate_type:{type:String}
    },
    {
        timestamps:true
    }
);





// Export
const FeeEntrySetting = mongoose.models.FeeEntrySetting || mongoose.model('FeeEntrySetting', FeeEntrySettingSchema);
export default FeeEntrySetting;