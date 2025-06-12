const fullnameValidate = (fullname) => {
    if (!fullname.trim()) return { error: true, message: "Full name is required!" };

    const isValid = /^[A-Za-zÀ-ỹ\s]+$/.test(fullname);
    if (!isValid) return { error: true, message: "Full name must only contain letters and spaces!" };

    if (fullname.length < 2) return { error: true, message: "Full name must be at least 2 characters long!" };

    return { error: false, message: "" };
};

export default fullnameValidate;
