import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { ParamMissingError } from '../../util/errors';
import userService from './user.service';

const router = Router();
const { OK } = StatusCodes;

const paths = {
	get: '/get',
	update: '/update',
	delete: '/delete',
};

/**
 * Get all users.
 */
router.get(paths.get, async (req: Request, res: Response) => {
	const { username } = req.params;
	const user = await userService.getUser(username);
	return res.status(OK).json({ user });
});

/**
 * Update one user.
 */
router.put(paths.update, async (req: Request, res: Response) => {
	const { user } = req.body;
	if (!user) {
		const error = new ParamMissingError();
		return res.status(error.HttpStatus).json(error);
	}
	return res.status(OK).end();
});

/**
 * Delete one user.
 */
router.delete(paths.delete, async (req: Request, res: Response) => {
	const { email } = req.params;
	if (!email) {
		const error = new ParamMissingError();
		return res.status(error.HttpStatus).json(error);
	}
	try {
		await userService.deleteUser(email);
		return res.status(OK).end();
	} catch (error) {
		return res.status(error.HttpStatus).json(error);
	}
});

export default router;
