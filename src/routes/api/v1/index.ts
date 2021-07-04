import express, { Request, Response } from 'express';
const router = express.Router();

import authRouter from './auth';
import userRouter from './user';

/* GET home page. */

router.use('/auth', authRouter);

router.use('/user', userRouter);

router.get('/', function (req: Request, res: Response) {
    res.send({ title: 'Express' });
    return;
});

export default router;
