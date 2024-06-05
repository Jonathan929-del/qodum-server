// Import
import mongoose from 'mongoose';





// Payment schema
const PaymentSchema = new mongoose.Schema(
    {
        // Others
        student:{type:String},
        image:{type:String},
        receipt_no:{type:String, unique:true},
        ref_no:{type:String},
        installments:{type:Array},
        received_date:{type:Date},
        remarks:{type:String},
        paymode:{type:String},
        paymode_details:{type:Object},
        fee_type:{type:String},
        advance_dues_number:{type:String},
        class_name:{type:String},
        board:{type:String},
        adm_no:{type:String},
        father_name:{type:String},
        school_name:{type:String},
        school_address:{type:String},
        website:{type:String},
        school_no:{type:String},
        affiliation_no:{type:String},
        logo:{type:String},
        wing_name:{type:String},
        entry_mode:{type:String},
        is_new:{type:Boolean},
        is_active:{type:Boolean},
        student_status:{type:String},
        bank_name:{type:String},
        fee_group:{type:String},
        session:{type:String},
        is_canceled:{type:Boolean},




        // Amounts
        actual_amount:{type:Number},
        concession_amount:{tyoe:Number},
        paid_amount:{type:Number},
        paid_heads:{type:Array},
        concession_reason:{type:String}
    },
    {
        timestamps:true
    }
);





// Export
const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
export default Payment;