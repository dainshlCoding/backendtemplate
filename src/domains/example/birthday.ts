import { Document } from 'mongoose';

export interface Birthday extends Document {
	oid: string
	firstName: string;
	lastName?: string;
	birthday: string;
}
