import * as expressValidator from 'express-validator';

export interface ValidationErrorInterface {
    param: string,
    msg: string
}
interface formatterOptions {
    location: string,
    msg: string,
    param: string,
    value: string,
    nestedErrors: string
}

const formatter = (options: formatterOptions): ValidationErrorInterface => {
    return {
        param: options.param,
        msg: options.msg
    };
};


const defaultOptions: object = {
    formatter
};

// export all required functions from here;

export const check = expressValidator.check;
export const body = expressValidator.body;
export const param = expressValidator.param;
export const query = expressValidator.query;

export const validationResult = expressValidator.validationResult.withDefaults(defaultOptions);
