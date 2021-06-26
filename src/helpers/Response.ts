import { Response } from 'express';
import { ValidationErrorInterface } from 'utils/validator'
interface ResOptions {
    lang: string,
    data: object,
    meta: object,
    type: string
    error: object,
    fieldErrors: ValidationErrorInterface[],
    constants: object
}

interface ErrConstant {
    status?: number,
    message: string,
    type: string
}
interface ErrConstants {
    [key: string]: ErrConstant
}

interface ResBody {
    success?: boolean,
    status?: number,
    data?: object,
    message?: string,
    meta?: object,
    errors?: object
}

class Res {

    public res;
    public lang: string = 'en';
    public data: object = {};
    public meta: object = {};
    public type: string = 'UnknownError';
    public error: object = {}
    public fieldErrors: ValidationErrorInterface[] = [];

    private constants: ErrConstants = {};
    private success: boolean = false;


    constructor(res: Response, options: ResOptions) {

        this.res = res;

        this.lang = options?.lang || 'en';

        this.success = false;

        this.data = options?.data || undefined;

        this.meta = options?.meta || undefined;

        this.type = options?.type || 'UnknownError';

        this.fieldErrors = options?.fieldErrors || undefined;

        this.constants = require(`data/lang/constants.${this.lang}.json`);

    }

    getMessageDetails(type: keyof ErrConstants): ErrConstant {

        return this.constants[type] || this.constants['UnknownError' as keyof object];

    }

    populateFieldErrors(errors: ValidationErrorInterface[]): object {

        return errors.reduce((acc: { [key: string]: string[] }, error: ValidationErrorInterface): object => {
            let message = this.constants[error.msg]?.message || error.msg;
            if (acc[error.param]) {
                acc[error.param] = [...acc[error.param], message];
                return acc;
            }
            acc = { ...acc, [error.param]: [message] };
            return acc;
        }, {});

    }

    send() {

        let resBody: ResBody = {
            status: 400,
        };

        let metaData: ErrConstant | undefined;

        if (this.type) {
            metaData = this.getMessageDetails(this.type);
        }

        if (metaData) {

            let { status } = metaData;
            resBody.status = status;

        } else {

            let { type, message, status }: ErrConstant = this.getMessageDetails(
                'UnknownError'
            );

            resBody.status = status;

            metaData = { type, message };

        }

        if (resBody.status === 200) {

            resBody.success = true;

            resBody.data = this.data || {};

            resBody.meta = {
                ...this.meta,
                type: metaData?.type,
                message: metaData?.message,
            };

        } else {

            if (this.fieldErrors) {
                resBody.errors = this.populateFieldErrors(this.fieldErrors);
            }

            resBody.success = false;

            resBody.data = this.data;

            resBody.meta = {
                ...this.meta,
                type: metaData?.type,
                message: metaData?.message,
            };

        }

        if (process.env.NODE_ENV === 'dev' && this.error) {
            console.error(this.error);
        }

        this.res.status(resBody.status || 200).send(resBody);
    }
}

export default Res;
