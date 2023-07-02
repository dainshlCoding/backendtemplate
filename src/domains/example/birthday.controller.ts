import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { ParamMissingError } from '../../util/errors';
import birthdayService from './birthday.service';

const router = Router();
const { OK } = StatusCodes;

const paths = {
	get: '/get',
	create: '/create',
	update: '/update',
	delete: '/delete',
};

/**
 * Get all birthdays belonging to a user.
 */
router.get(paths.get, async (req: Request, res: Response) => {
	const { user } = req.body;
	try {
		const result = await birthdayService.getBirthdays(user._id);
		return res.status(OK).json(result);
	} catch (error) {
		return res.status(error.HttpStatus).json(error);
	}
});

/**
 * Create a new birthday entry.
 */
router.post(paths.create, async (req: Request, res: Response) => {
	const { birthday, user } = req.body;
	if (!birthday) {
		const error = new ParamMissingError();
		return res.status(error.HttpStatus).json(error);
	}
	try {
		const createdBirthday = await birthdayService.createBirthday(birthday, user._id);
		return res.status(OK).json({ birthday: createdBirthday });
	} catch (error) {
		return res.status(error.HttpStatus).json(error);
	}
});

/**
 * Update an existing birthday entry.
 */
router.patch(paths.update, async (req: Request, res: Response) => {
	const { birthday } = req.body;

	if (!birthday) {
		const error = new ParamMissingError();
		return res.status(error.HttpStatus).json(error);
	}
	try {
		const updatedBirthday = await birthdayService.updateBirthday(birthday);
		return res.status(OK).json({ birthday: updatedBirthday });
	} catch (error) {
		return res.status(error.HttpStatus).json(error);
	}
});

/**
 * Delete a birthday object from database.
 */
router.delete(paths.delete, async (req: Request, res: Response) => {
	const _id: string = req.query._id as string;
	if (!_id) {
		const error = new ParamMissingError();
		return res.status(error.HttpStatus).json(error);
	}
	try {
		const deletedBirthday = await birthdayService.deleteBirthday(_id);
		return res.status(OK);
	} catch (error) {
		return res.status(error.HttpStatus).json(error);
	}
});

export default router;
