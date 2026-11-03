export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
};

export const isValidName = (name) => {
    return typeof name === "string" && name.trim().length > 0;
};

export const isValidPrice = (price) => {
    return price !== "" && 
        price !== null &&
        price !== undefined &&
        Number.isFinite(Number(price)) &&
        Number(price) > 0;
};

export const isValidCategory = (categoryId) => {
    return Number.isInteger(Number(categoryId)) && Number(categoryId) > 0;
};