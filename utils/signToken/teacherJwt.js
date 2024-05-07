// Imports
import jwt from 'jsonwebtoken';





// Sign jwt token
const signToken = teacher => {
    return jwt.sign({
        id:teacher._id,
        type:teacher.type,
        background_image:teacher.background_image,
        image:teacher.image,
        name:teacher.name,
        adm_no:teacher.adm_no,
        password:teacher.password,
        mobile:teacher.mobile,
        dob:teacher.dob,
        doj:teacher.doj,
        marital_status:teacher.marital_status,
        father_name:teacher.father_name,
        doa:teacher.doa,
        gender:teacher.gender,
        nationality:teacher.nationality,
        religion:teacher.religion,
        qualification:teacher.qualification,
        address:teacher.address,
        permenant_address:teacher.permenant_address,
        aadhar_card_no:teacher.aadhar_card_no,
        pan_card_no:teacher.pan_card_no,
        bank_account_no:teacher.bank_account_no,
        uan_number:teacher.uan_number,
        contact_nos:teacher.contact_nos,
        father_contact_no:teacher.father_contact_no,
        email:teacher.email
    },
    process.env.SECRET_JWT_KEY,
    {
        expiresIn:'30d'
    });
};





// Export
export default signToken;