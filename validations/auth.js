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