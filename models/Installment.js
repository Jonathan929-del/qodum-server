// Import
import mongoose from 'mongoose';





// Installment schema
const InstallmentSchema = new mongoose.Schema(
        {
            name:{type:String, required:true, unique:true},
            print_name:{type:String, required:true},
            preference_no:{type:Number, required:true, unique:true},
            due_on_date:{
                day:{type:String, required:true},
                month:{type:String, required:true},
                year:{type:String, required:true},
            },
            due_date:{
                day:{type:String, required:true},
                month:{type:String, required:true},
                year:{type:String, required:true},
            },
            months:[{type:String, max:13}]
        },
        {
            timestamps:true
        }
    );





// Export
const Installment = mongoose.models.Installment || mongoose.model('Installment', InstallmentSchema);
export default Installment;