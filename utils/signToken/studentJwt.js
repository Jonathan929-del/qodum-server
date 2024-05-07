// Imports
import jwt from 'jsonwebtoken';





// Sign jwt token
const signToken = student => {
    return jwt.sign({
        id:student._id,
        adm_no:student.student.adm_no,

        student:{
            name:student.student.name,
            class_name:student.student.class_name,
            image:student.student.image,
            background_image:student.student.background_image,
            doa:student.student.doa,
            dob:student.student.dob,
            pen_no:student.student.pen_no,
            blood_group:student.student.blood_group,
            house:student.student.house,
            address:student.student.address,
            contact_person_mobile:student.student.contact_person_mobile,
            roll_no:student.student.roll_no,
            aadhar_card_no:student.student.aadhar_card_no
        },
        
        parents:{
            father:{
                father_name:student.parents.father.father_name,
            },
            mother:{
                mother_name:student.parents.mother.mother_name,
            }
        }
    },
    process.env.SECRET_JWT_KEY,
    {
        expiresIn:'30d'
    });
};





// Export
export default signToken;