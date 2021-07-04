import { Request, Response } from 'express';

export const getDetails = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        res.send({
            success: true
        });
    } catch (e) {
        res.send({
            success: false
        });
    }
};
