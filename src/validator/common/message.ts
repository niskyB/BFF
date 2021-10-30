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

export const numberCustomMessage = {
    "any.required": "required",
    "number.min": "should be not below 0"
}

export const dateCustomMessage = {
    "date.required": "required",
}

export const productArrayCustomMessage = {
    "any.required": "required",
    "any.min": "should contain at least 1 product",
}