const passwordValidate = (password) => {
    if (!password.trim()) return { error: true, message: "Password is required!" };

    if (password.length < 8) return { error: true, message: "Password must be at least 8 characters long!" };

    if (!/[A-Z]/.test(password)) return { error: true, message: "Password must contain at least one uppercase letter!" };

    if (!/[a-z]/.test(password)) return { error: true, message: "Password must contain at least one lowercase letter!" };

    if (!/[0-9]/.test(password)) return { error: true, message: "Password must contain at least one number!" };

    if (!/[!@#$%^&*]/.test(password)) return { error: true, message: "Password must contain at least one special character (!@#$%^&*)" };

    return { error: false, message: "" };
};

export default passwordValidate;
