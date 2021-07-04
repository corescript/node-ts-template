import RateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize'
import redisClient from 'utils/redis';
import errorHandler from 'middleware/errorHandler';
import * as db from 'db';
import router from './routes';
import express from 'express';
// import csurf from 'csurf';

const app = express();

// Connect database
db.connect();

app.set('view engine', 'ejs');
// Disable insecure headers
app.disable('x-powered-by');
// Rate limiting


const limiter = RateLimit({
    store: new RedisStore({
        client: redisClient
    }),
    max: 100
});

// const csrfProtection = csurf({ cookie: true });

// MIDDLEWARES

app.use(limiter);
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(csrfProtection);
app.use(mongoSanitize());

app.use('/', router);

app.use(errorHandler);

export default app;









