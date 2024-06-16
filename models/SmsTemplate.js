// Import
import mongoose from 'mongoose';





// Sms template schema
const SmsTemplateSchema = new mongoose.Schema(
        {
            sms_type:{type:String, required:true},
            sms_template:{type:String, required:true},
            is_enable:{type:Boolean}
        },
        {
            timestamps:true
        }
    );





// Export
const SmsTemplate = mongoose.models.SmsTemplate || mongoose.model('SmsTemplate', SmsTemplateSchema);
export default SmsTemplate;