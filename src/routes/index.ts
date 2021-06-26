import express from 'express';
import apiRouterV1 from './api/v1';
import pageRouter from './pages';


var router = express.Router();


/* API Routes */

router.all('/api/v1', apiRouterV1);

/**
 * Page routes
 */

router.all('/', pageRouter);

export default router
