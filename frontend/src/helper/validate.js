import toast from 'react-hot-toast';

export async function loginValidate(values) {
    const errors = emailVerify({}, values);
    passwordVerify(errors, values);
    return errors;
}

export async function passwordValidate(values) {
    const errors = passwordVerify({}, values);

    return errors;
}

export async function registerValidate(values) {
    const errors = emailVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);
    return errors;
}

// function emailVerify(error = {}, values) {
//     if(!values.email) {
//         error.email = toast.error('email Required!');
//     }else if (values.email.includes(" ")) {
//         error.email = toast.error('Invalid email!');
//     }

//     return error;
// }

function passwordVerify(errors = {}, values) {
    if(!values.password) {
        errors.password = toast.error("Password Required");
    } else if(values.password.includes(" ")) {
        errors.password = toast.error("Wrong Password");
    }else if(values.password.length < 4) {
        errors.password = toast.error("Password must be more than 4 characters long");
    }

    return errors;
}

function emailVerify(errors = {}, values) {
    if(!values.email) {
        errors.email = toast.error("Email Required");
    }else if(values.email.includes(" ")) {
        errors.email = toast.error("Wrong Email...");
    }else if (!/^[A-Z0-9._%+-]+@[A-Z0-9,-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = toast.error("Invalid Email");
    }
}