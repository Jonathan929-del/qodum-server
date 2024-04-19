// Imports
import mongoose from 'mongoose';





// App users schema
const AppUserSchema = mongoose.Schema({
    name:{type:String},
    password:{type:String}
});





// Export
export default mongoose.model('AppUser', AppUserSchema);