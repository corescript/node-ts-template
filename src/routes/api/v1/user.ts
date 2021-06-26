import express from 'express';
import * as User from 'controllers/User'

var router = express.Router();


router.post('/details', User.getDetails);

export default router;
