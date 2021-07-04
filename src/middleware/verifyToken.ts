import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cache from 'utils/redis';
import * as db from 'db';
import { JWT_SECRET } from 'config/constants';

interface Payload extends jwt.JwtPayload {
    _id: string;
}

const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let authHeader: string = req.header('authorization') || '';
        authHeader = authHeader?.split(' ').pop() || '';

        if (!authHeader) {
            const err = new Error();
            err.message = 'Unauthorized';
            throw err;
        }

        try {
            jwt.verify(authHeader, JWT_SECRET);
        } catch (err) {
            err.message = 'Unauthorized';
            next(err);
            return;
        }

        const tokenData: Payload = jwt.decode(authHeader) as Payload;

        const { _id } = tokenData;

        const user = await db.User.findOne({
            _id,
            isActive: true
        });

        if (!user) {
            const err = new Error();
            err.message = 'Unauthorized';
            throw err;
        }

        const token = db.Token.findOne({ token: authHeader });

        if (!token || token.user !== user._id) {
            const err = new Error();
            err.message = 'Unauthorized';
            throw err;
        }

        const _key = `user_${_id}`;
        // Set user details in cache to avoid db call
        await cache.set(_key, JSON.stringify(user));

        req.user = user;

        next();
    } catch (err) {
        console.log(err);
        err.message = 'Unauthorized';
        next(err);
    }
};

export default verifyToken;
