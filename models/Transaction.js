// Import
import mongoose from 'mongoose';





// Transaction schema
const TransactionShcema = new mongoose.Schema(
        {
            type:{type:String},
        },
        {
            timestamps:true
        }
    );





// Export
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionShcema);
export default Transaction;