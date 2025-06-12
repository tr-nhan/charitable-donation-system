const confirmPassword = (password, confirmPassword) => {
    if (!confirmPassword.trim()) return { error: true, message: "Confirm password is required!" };

    if (password !== confirmPassword) return { error: true, message: "Passwords do not match!" };

    return { error: false, message: "" };
};

export default confirmPassword;
