import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { log } from '../../util/logger';
import { DeletingFailedError, CreationFailedError, UpdatingFailedError } from '../../util/errors';
import { Birthday } from './birthday';
import { BirthdayDto, CreateBirthdayDto } from './birthday.dto';

const { Schema } = mongoose;

const BirthdaySchema = new Schema<Birthday>({
	oid: { type: String, required: true, ref: 'User' },
	firstName: { type: String, required: true },
	lastName: { type: String },
	birthday: { type: String, required: true },
});
BirthdaySchema.plugin(mongooseUniqueValidator);

const BirthdayModel = mongoose.model<Birthday>('Birthday', BirthdaySchema);

async function getBirthdays(oid: string): Promise<Birthday[] | null> {
	return await BirthdayModel.find({ oid: oid }).exec();
}

async function createBirthday(createBirthdayDto: CreateBirthdayDto): Promise<Birthday> {
	const birthday = new BirthdayModel({
		...createBirthdayDto,
	});
	try {
		const saved = await birthday.save();
		log(saved);
		return saved;
	} catch (error) {
		throw new CreationFailedError(error, createBirthdayDto);
	}
}

async function updateBirthday(birthdayDto: BirthdayDto): Promise<Birthday | null> {
	try {
		const result = await BirthdayModel.findByIdAndUpdate(birthdayDto._id, birthdayDto, { new: true }).exec();
		return result;
	} catch (error) {
		throw new UpdatingFailedError(error, birthdayDto);
	}
}

async function deleteBirthday(_id: string): Promise<Birthday | null> {
	try {
		const deleted = await BirthdayModel.findByIdAndDelete(_id);
		log(deleted);
		return deleted;
	} catch (error) {
		throw new DeletingFailedError(error, _id, 'birthday');
	}
}

export default {
	getBirthdays,
	createBirthday,
	updateBirthday,
	deleteBirthday,
} as const;
