import { Request, Response, NextFunction } from 'express';
import Res from 'helpers/Res';

export default (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.log(err);

    if (err.message) {
        const response = new Res(res, {
            type: err.message
        });
        response.send();
        return;
    }

    const response = new Res(res, {
        type: 'UnknownError'
    });

    response.send();
    next();
    return;
};
