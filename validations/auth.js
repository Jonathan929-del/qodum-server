// Validate adm no
export const validateAdmNo = (adm_no) => {
    const errors = {};
    if(adm_no.trim() === ''){
        errors.adm_no = "Admission number can't be empty";
    }
    return {
        errors,
        valid:Object.keys(errors).length < 1
    }
};





// Validate register inputs
export const validateRegisterInputs = (password, confirm_password) => {
    const errors = {};
    if(password === ''){
        errors.password = "Password can't be empty";
    }
    if(password.length < 6){
        errors.password = "Password must contain 6 characters at least";
    }
    if(password !== confirm_password){
        errors.confirm_password = "Passwords don't match";
    }

    return {
        errors,
        valid:Object.keys(errors).length < 1
    }
};





// Validate login inputs
export const validateLoginInputs = (adm_no, password) => {
    const errors = {};
    if(adm_no.trim() === ''){
        errors.adm_no = "Admission number can't be empty";
    };
    if(password === ''){
        errors.password = "Password can't be empty";
    };

    return {
        errors,
        valid:Object.keys(errors).length < 1
    }
};





// Validate apply for admission page
export const validateApplyForAdmission = ({
    class_name,
    name,
    gender,
    father_name,
    father_occupation,
    father_annual_income,
    mother_name,
    mother_occupation,
    mother_annual_income,
    father_mobile,
    mother_mobile,
    email,
    address,
    city,
    state,
    last_school_name,
    last_class
}) => {
    const errors = {};
    const containsOnlyNumbers = str => {
        return /^\d+$/.test(str);
    };
    if(!class_name){
        errors.message = 'Please enter class name';
    };
    if(!name){
        errors.message = 'Please enter student name';
    };
    if(!gender){
        errors.message = 'Please enter student gender';
    };
    if(!father_name){
        errors.message = "Please enter student's father name";
    };
    if(!father_occupation){
        errors.message = "Please enter student's father occupation";
    };
    if(!father_annual_income){
        errors.message = "Please enter student's father annual income";
    };
    if(!mother_name){
        errors.message = "Please enter student's mother name";
    };
    if(!mother_occupation){
        errors.message = "Please enter student's mother occupation";
    };
    if(!mother_annual_income){
        errors.message = "Please enter student's mother annual income";
    };
    if(!father_mobile || !containsOnlyNumbers(father_mobile) || Math.abs(father_mobile).toString().length !== 10 || typeof father_mobile === 'number'){
        errors.message = "Please enter a valid student's father mobile no.";
    };
    if(!mother_mobile || !containsOnlyNumbers(mother_mobile) || Math.abs(mother_mobile).toString().length !== 10 || typeof mother_mobile === 'number'){
        errors.message = "Please enter a valid student's mother mobile no.";
    };
    if(!email){
        errors.message = "Please enter student's email";
    };
    if(!address){
        errors.message = "Please enter student's address";
    };
    if(!city){
        errors.message = "Please enter student's city";
    };
    if(!state){
        errors.message = "Please enter student's state";
    };
    if(!last_school_name){
        errors.message = "Please enter student's last school name";
    };
    if(!last_class){
        errors.message = "Please enter student's last class name";
    };
    return {
        errors,
        valid:Object.keys(errors).length < 1
    };
};





// Validate candidate application
export const validateCandidateApplication = ({
    post,
    first_name,
    email,
    mobile,
    father_or_spouse_name,
    staff_type,
    designation,
    department,
    gender,
    address
}) => {
    const errors = {};
    const containsOnlyNumbers = str => {
        return /^\d+$/.test(str);
    };
    if(!first_name){
        errors.message = 'Please enter staff first name';
    };
    if(!post){
        errors.message = 'Please enter select post';
    };
    if(!email){
        errors.message = 'Please enter staff email';
    };
    if(!mobile || !containsOnlyNumbers(mobile) || Math.abs(mobile).toString().length !== 10 || typeof mobile === 'number'){
        errors.message = "Please enter a valid staff's mobile no.";
    };
    if(!father_or_spouse_name){
        errors.message = "Please enter staff's father/spouse_name";
    };
    if(!staff_type){
        errors.message = "Please enter staff's staff type";
    };
    if(!designation){
        errors.message = "Please enter staff's designation";
    };
    if(!department){
        errors.message = "Please enter staff's department";
    };
    if(!gender){
        errors.message = "Please enter staff's gender";
    };
    if(!address){
        errors.message = "Please enter staff's address";
    };
    return {
        errors,
        valid:Object.keys(errors).length < 1
    };
};