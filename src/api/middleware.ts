import StatusCodes from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import expressJwt from 'express-jwt';
import authService from '../services/auth.service';
import { JwtMissingError } from '../util/errors';
import { Roles } from '../models/role.enum';

const { UNAUTHORIZED } = StatusCodes;
const pubKey = process.env.RS256PUBKEY.replace(/\\n/g, '\n');

/**
 * Middleware to verify if user is an admin.
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function adminMw(req: Request, res: Response, next: NextFunction) {
	if (!req.headers.authorization) {
		return new JwtMissingError();
	}
	const user = authService.checkToken(req.headers.authorization);
	if (!user || user.role !== Roles.admin) {
		return res.status(UNAUTHORIZED).json();
	}
	next();
}

/**
 * Middleware to verify if user has a valid JWT.
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function jwtCheck(req: Request, res: Response, next: NextFunction) {
	expressJwt({
		secret: pubKey,
		algorithms: ['RS256'],
	});
	if (req.method !== 'OPTIONS') {
		if (!req.headers.authorization) {
			const error = new JwtMissingError();
			return res.status(error.HttpStatus).json(error);
		}
		const user = authService.checkToken(req.headers.authorization);
		req.body.user = user;
	}
	next();
}
