import mongoose, { Document } from 'mongoose';
import { Roles } from '../../models/role.enum';

export interface User extends Document {
	username: string;
	email: string;
	password: string;
	role: Roles;
	firstName: string,
	lastName: string
	profileId: mongoose.Types.ObjectId;
	settingsId: mongoose.Types.ObjectId;
	unlocked: boolean;
}
