import express from 'express';
import * as Auth from 'controllers/Auth';

var router = express.Router();

/* GET home page. */

router.post('/login', Auth.login, Auth.login.validate);
router.delete('/logout', Auth.logout);

export default router;
