import { Request, Response, NextFunction } from 'express';
import * as db from 'db';
import Res from 'helpers/Res';
import { check, validationResult } from 'utils/validator';
import * as encrypt from 'utils/encrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'config/constants';

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            const response = new Res(res, {
                type: 'ValidationError',
                fieldErrors: error.array()
            });
            response.send();
            return;
        }

        const { email, password } = req.body;

        const user = await db.User.findOne({ email });

        if (!user) {
            const response = new Res(res, {
                type: 'InvalidAuth'
            });
            response.send();
            return;
        }

        if (!encrypt.compare(password, user.password)) {
            const response = new Res(res, {
                type: 'InvalidAuth'
            });
            response.send();
            return;
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET);

        await db.Token.create({ user: user._id, token });

        const userFields = ['name', 'email', 'role'];

        const updatedUser = await db.User.findByIdAndUpdate(
            user._id,
            {
                lastLoggedIn: new Date()
            },
            { new: true }
        ).select(userFields);

        const response = new Res(res, {
            type: 'SuccessResponse',
            data: {
                user: updatedUser,
                token
            }
        });

        response.send();
        return;
    } catch (e) {
        next(e);
    }
};

login.validate = [check('email').isEmail().withMessage('InvalidEmail')];
