import express from 'express';
import apiRouterV1 from './api/v1';
import pageRouter from './pages';


const router = express.Router();


/* API Routes */

router.use('/api/v1', apiRouterV1);

/**
 * Page routes
 */

router.use('/', pageRouter);

export default router
