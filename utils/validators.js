const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

const validatePassword = (password) => {
    return String(password).length >= 6;
};

export default { validateEmail, validatePassword };