import express, { Request, Response } from 'express';
var router = express.Router();

import authRouter from './auth';
import userRouter from './user';

/* GET home page. */

router.all('/auth', authRouter);

router.all('/user', userRouter);

router.get('/', function (req: Request, res: Response) {
    res.send({ title: 'Express' });
    return;
});

export default router;
