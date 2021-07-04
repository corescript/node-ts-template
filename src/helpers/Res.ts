import { Response } from 'express';
import { ValidationErrorInterface } from 'utils/validator';
interface ResOptions {
    lang?: string;
    data?: Record<string, unknown>;
    meta?: Record<string, unknown>;
    type: string;
    error?: Record<string, unknown>;
    fieldErrors?: ValidationErrorInterface[];
    constants?: Record<string, unknown>;
}

interface ErrConstant {
    status?: number;
    message: string;
    type: string;
}
interface ErrConstants {
    [key: string]: ErrConstant;
}

interface ResBody {
    success?: boolean;
    status?: number;
    data?: Record<string, unknown>;
    message?: string;
    meta?: Record<string, unknown>;
    errors?: Record<string, unknown>;
}

class Res {
    public res;
    public lang = 'en';
    public data = {};
    public meta = {};
    public type = 'UnknownError';
    public error = {};
    public fieldErrors: ValidationErrorInterface[] = [];

    private constants: ErrConstants = {};
    private success = false;

    constructor(res: Response, options: ResOptions) {
        this.res = res;

        this.lang = options?.lang || 'en';

        this.success = false;

        this.data = options?.data || '';

        this.meta = options?.meta || '';

        this.type = options?.type || 'UnknownError';

        this.fieldErrors = options?.fieldErrors || [];

        this.constants = require(`data/lang/constants.${this.lang}.json`);
    }

    getMessageDetails(type: keyof ErrConstants): ErrConstant {
        return (
            this.constants[type] ||
            this.constants['UnknownError' as keyof ErrConstants]
        );
    }

    populateFieldErrors(
        errors: ValidationErrorInterface[]
    ): Record<string, unknown> {
        return errors.reduce(
            (acc, error: ValidationErrorInterface): Record<string, unknown> => {
                const message = this.constants[error.msg]?.message || error.msg;
                if (acc[error.param]) {
                    acc[error.param] = [...acc[error.param], message];
                    return acc;
                }
                acc = { ...acc, [error.param]: [message] };
                return acc;
            },
            {} as Record<string, any>
        );
    }

    send(): void {
        const resBody: ResBody = {
            status: 400
        };

        let metaData: ErrConstant | undefined;

        if (this.type) {
            metaData = this.getMessageDetails(this.type);
        }

        if (metaData) {
            const { status } = metaData;
            resBody.status = status;
        } else {
            const { type, message, status }: ErrConstant =
                this.getMessageDetails('UnknownError');

            resBody.status = status;

            metaData = { type, message };
        }

        if (resBody.status === 200) {
            resBody.success = true;

            resBody.data = this.data || {};

            resBody.meta = {
                ...this.meta,
                type: metaData?.type,
                message: metaData?.message
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
                message: metaData?.message
            };
        }

        if (process.env.NODE_ENV === 'dev' && this.error) {
            console.error(this.error);
        }

        this.res.status(resBody.status || 200).send(resBody);
        return;
    }
}

export default Res;
