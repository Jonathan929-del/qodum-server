// Import
import mongoose from 'mongoose';





// Fee type schema
const FeeTypeSchema = new mongoose.Schema(
        {
            name:{type:String, required:true, unique:true},
            preference_no:{type:Number, required:true, unique:true},
            heads:[{type:String}]
        },
        {
            timestamps:true
        }
    );





// Export
const FeeType = mongoose.models.FeeType || mongoose.model('FeeType', FeeTypeSchema);
export default FeeType;