import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import { log } from '../../util/logger';
import { DeletingFailedError, CreationFailedError, UserNotUniqueError } from '../../util/errors';
import { User } from './user.entity';
import { UserCreateDto } from './user.dto';

const { Schema } = mongoose;

const UserSchema = new Schema<User>({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	password: { type: String, required: true },
	role: { type: String, required: true },
	profileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
	settingsId: { type: Schema.Types.ObjectId, ref: 'Settings' },
	unlocked: { type: Boolean, required: true },
});
UserSchema.plugin(mongooseUniqueValidator);

const UserModel = mongoose.model<User>('User', UserSchema);

async function getUser(username: string, email?: string): Promise<User | null> {
	if (email) {
		return await UserModel.findOne({ email: email, unlocked: true }).exec();
	} else {
		return await UserModel.findOne({ username: username, unlocked: true }).exec();
	}
}

async function getAllUser(username?: string): Promise<User[] | null> {
	if (username) {
		return await UserModel.find({ username: { $ne: username }, unlocked: true }).exec();
	} else {
		return await UserModel.find().exec();
	}
}

async function createUser(userCreateDto: UserCreateDto): Promise<User> {
	const hash = await hashPassword(userCreateDto.password);
	const user = new UserModel({
		username: userCreateDto.username,
		email: userCreateDto.email,
		password: hash,
		role: userCreateDto.role,
		unlocked: false,
	});
	try {
		const saved = await user.save();
		log(saved);
		return saved;
	} catch (error) {
		if (error.errors?.username?.kind === 'unique' || error.errors?.email?.kind === 'unique') {
			throw new UserNotUniqueError(error);
		}
		throw new CreationFailedError(error, userCreateDto);
	}
}

async function deleteUser(email: string): Promise<User | null> {
	try {
		const saved = await UserModel.findOneAndDelete({ email: email });
		log(saved);
		return saved;
	} catch (error) {
		throw new DeletingFailedError(error, email, 'user');
	}
}

async function hashPassword(pw: string): Promise<string> {
	const saltRounds = 10;
	const salt = await bcrypt.genSalt(saltRounds);
	return await bcrypt.hash(pw, salt);
}

export default {
	getUser,
	getAllUser,
	createUser,
	deleteUser,
} as const;
