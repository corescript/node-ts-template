import { Request, Response } from 'express';

export const getDetails = (req: Request, res: Response) => {
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
