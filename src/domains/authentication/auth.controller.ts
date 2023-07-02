import { Request, Response, Router } from 'express';
import StatusCodes from 'http-status-codes';
import { JwtMissingError, ParamMissingError } from '../../util/errors';
import { UserCreateDto, UserDto } from './user.dto';
import authService from './auth.service';

const router = Router();
const { OK } = StatusCodes;

const paths = {
	login: '/login',
	logout: '/logout',
	signup: '/signup',
	check: '/checkToken',
	refresh: '/refreshToken',
};

/**
 * User loggs in
 */
router.post(paths.login, async (req: Request, res: Response) => {
	const { email, password }: { email: string; password: string } = req.body;
	if (!(email && password)) {
		const error = new ParamMissingError();
		return res.status(error.HttpStatus).json(error);
	}
	try {
		const response: { jwt: string; user: UserDto; expires: number } = await authService.login(email, password);
		return res.status(OK).json({ jwt: response.jwt, user: response.user, expires: response.expires });
	} catch (error) {
		return res.status(error.HttpStatus).json(error);
	}
});

/**
 * User signs up.
 */
router.post(paths.signup, async (req: Request, res: Response) => {
	const { userCreateDto }: { userCreateDto: UserCreateDto } = req.body;
	if (!userCreateDto) {
		const error = new ParamMissingError();
		return res.status(error.HttpStatus).json(error);
	}
	try {
		await authService.signUp(userCreateDto);
		return res.status(OK).json();
	} catch (error) {
		return res.status(error.HttpStatus).json(error);
	}
});

/**
 * Check existing jwt on each page reload.
 */
router.post(paths.check, async (req: Request, res: Response) => {
	const { jwt }: { jwt: string } = req.body;
	if (!jwt) {
		const error = new JwtMissingError();
		return res.status(error.HttpStatus).json(error);
	}
	try {
		const user = await authService.checkToken(jwt);
		return res.status(OK).json({ user });
	} catch (error) {
		return res.status(error.HttpStatus).json(error);
	}
});

/**
 * Refresh jwt before it expires.
 */
router.post(paths.refresh, async (req: Request, res: Response) => {
	const { jwt }: { jwt: string } = req.body;
	if (!jwt) {
		const error = new ParamMissingError();
		return res.status(error.HttpStatus).json(error);
	}
	try {
		const response: { jwt: string; expires: number } = authService.refreshToken(jwt);
		return res.status(OK).json({ jwt: response.jwt, expires: response.expires });
	} catch (error) {
		return res.status(error.HttpStatus).json(error);
	}
});

export default router;
