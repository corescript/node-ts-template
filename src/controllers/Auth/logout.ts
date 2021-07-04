import { Request, Response, NextFunction } from 'express';
import * as db from 'db';
import Res from 'helpers/Res';

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let authHeader: string = req.header('authorization') || '';

        authHeader = authHeader?.split(' ').pop() || '';

        const token = await db.Token.findOne({ token: authHeader });
        
        await token.delete();

        const response = new Res(res, {
            type: 'SuccessResponse'
        });

        response.send();
        return;
    } catch (e) {
        next(e);
    }
};
