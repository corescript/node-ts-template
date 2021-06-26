import { Request, Response } from 'express';
import { check, validationResult } from 'utils/validator';

export const login = (req: Request, res: Response) => {
    try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            // let response = new Response(res, {
            //     type: 'NotLoggedIn',
            //     fieldErrors: error.array()
            // });
            res.end();
            return;
        }

        res.send({
            success: true
        });

    } catch (e) {

        res.send({
            success: true
        });

    }
};

login.validate = [
    check('email').isEmail().withMessage('InvalidEmail')
];