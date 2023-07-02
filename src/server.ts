import morgan from 'morgan';
import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import BaseRouter from './api/api';
import { CustomError } from './util/errors';
import logger from 'jet-logger';
import StatusCodes from 'http-status-codes';

const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '15mb' }));

app.use(function (req, res, next) {
	// Allowed frontends that can request data
	const allowedOrigins = [
		'https://client-three-silk.vercel.app',
		'https://client-dainshlba.vercel.app',
		'https://client-git-dev-dainshlba.vercel.app',
		'http://localhost:8100',
	];
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		res.setHeader('Access-Control-Allow-Origin', origin);
	}
	// Allowed API request methods
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	next();
});

// Show api called in console during development ????
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Security ?????
if (process.env.NODE_ENV === 'production') {
	app.use(helmet());
}

// Error handling
app.use((err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
	logger.err(err, true);
	const status = err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST;
	return res.status(status).json({
		error: err.message,
	});
});

// Add base route
app.use('/api', BaseRouter);

/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default app;
