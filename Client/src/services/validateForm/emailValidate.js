import { isValidEmail } from "../validData";

const emailValidate = (email) => {
    if (!email.trim()) return { error: true, message: "Email Address is required!" };

    const isValid = isValidEmail(email);
    if (!isValid) return { error: true, message: "Invalid Email Address" };

    return { error: false, message: "" };
};

export default emailValidate;
