export const stringCustomMessage = {
    "string.empty": "required",
    "any.required": "required",
    "string.min": "length should be at least 3 characters",
    "any.only": "should match with password"
};

export const stringCustomEmail = {
    ...stringCustomMessage,
    "string.email": "invalid email"
};

export const stringCustomPhone = {
    ...stringCustomMessage,
    "string.pattern.base": "invalid phone"
}