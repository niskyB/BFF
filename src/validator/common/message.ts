export const stringCustomMessage = {
    "string.empty": "required",
    "any.required": "required",
    "string.min": "length should be at least 3 characters"
};

export const stringCustomEmail = {
    ...stringCustomMessage,
    "string.email": "invalid email"
};
