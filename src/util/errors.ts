import HttpStatusCodes from 'http-status-codes';
import { logError } from './logger';

export abstract class CustomError extends Error {
	public readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;
	public errorMessage = '';

	protected constructor(msg: string, httpStatus: number) {
		super(msg);
		this.HttpStatus = httpStatus;
		this.errorMessage = msg;
	}
}

export class ParamMissingError extends CustomError {
	public static readonly Msg = 'One or more of the required parameters were missing.';
	public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

	constructor() {
		super(ParamMissingError.Msg, ParamMissingError.HttpStatus);
	}
}

export class UserNotFoundError extends CustomError {
	public static readonly Msg = 'A user with the given id does not exists in the database.';
	public static readonly HttpStatus = HttpStatusCodes.UNAUTHORIZED;
	public username: string;

	constructor(username: string) {
		super(UserNotFoundError.Msg, UserNotFoundError.HttpStatus);
		this.username = username;
	}
}

export class DataNotFoundError extends CustomError {
	public static readonly Msg = 'Data could not be found';
	public static readonly HttpStatus = HttpStatusCodes.NOT_FOUND;
	public model: string;
	public param: string;

	constructor(model: string, param?: string) {
		super(DataNotFoundError.Msg, DataNotFoundError.HttpStatus);
		this.model = model;
		this.param = param;
	}
}

export class UnknownEmailError extends CustomError {
	public static readonly Msg = 'Unknown Email';
	public static readonly HttpStatus = HttpStatusCodes.UNAUTHORIZED;
	public email: string;

	constructor(email: string) {
		super(UnknownEmailError.Msg, UnknownEmailError.HttpStatus);
		this.email = email;
	}
}

export class IncorrectPasswordError extends CustomError {
	public static readonly Msg = 'Password is incorrect';
	public static readonly HttpStatus = HttpStatusCodes.UNAUTHORIZED;

	constructor() {
		super(IncorrectPasswordError.Msg, IncorrectPasswordError.HttpStatus);
	}
}

export class JwtInvalidError extends CustomError {
	public static readonly Msg = 'Jwt could not be verified or is expired';
	public static readonly HttpStatus = HttpStatusCodes.UNAUTHORIZED;

	constructor() {
		super(JwtInvalidError.Msg, JwtInvalidError.HttpStatus);
	}
}

export class JwtMissingError extends CustomError {
	public static readonly Msg = 'No JWT in header';
	public static readonly HttpStatus = HttpStatusCodes.UNAUTHORIZED;

	constructor() {
		super(JwtMissingError.Msg, JwtMissingError.HttpStatus);
	}
}

export class CreationFailedError extends CustomError {
	public static readonly Msg = 'Creating object in database failed';
	public static readonly HttpStatus = HttpStatusCodes.INTERNAL_SERVER_ERROR;
	public dtoObject: any;

	constructor(error: Error, dto: any) {
		super(CreationFailedError.Msg, CreationFailedError.HttpStatus);
		this.dtoObject = dto;
		logError(error);
	}
}

export class UserNotUniqueError extends CustomError {
	public static readonly Msg = 'Username or email already in use';
	public static readonly HttpStatus = HttpStatusCodes.NOT_ACCEPTABLE;

	constructor(error: Error) {
		super(CreationFailedError.Msg, CreationFailedError.HttpStatus);
		logError(error);
	}
}

export class UpdatingFailedError extends CustomError {
	public static readonly Msg = 'Updating failed';
	public static readonly HttpStatus = HttpStatusCodes.INTERNAL_SERVER_ERROR;
	public dtoObject: any;

	constructor(error: Error, dto?: any) {
		super(UpdatingFailedError.Msg, UpdatingFailedError.HttpStatus);
		this.dtoObject = dto;
		logError(error);
	}
}

export class DeletingFailedError extends CustomError {
	public static readonly Msg = 'Deleting failed';
	public static readonly HttpStatus = HttpStatusCodes.INTERNAL_SERVER_ERROR;
	public identifier: string;
	public model: string;

	constructor(error: Error, identifier: string, model: string) {
		super(DeletingFailedError.Msg, DeletingFailedError.HttpStatus);
		this.identifier = identifier;
		this.model = model;
		logError(error);
	}
}
