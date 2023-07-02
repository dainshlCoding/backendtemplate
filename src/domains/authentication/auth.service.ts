import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { UnknownEmailError, JwtInvalidError, IncorrectPasswordError } from '../../util/errors';
import { UserCreateDto, UserDto } from './user.dto';
import userRepository from './user.repository';
import { mapUserToUserDto } from './user.mapper';
import { Roles } from '../../models/role.enum';
import { sendUnlockUserMail } from '../../services/mail.service';

const privKey = process.env.RS256PK.replace(/\\n/g, '\n')
/**
 * Login()
 *
 * @param email
 * @param password
 * @returns
 */
async function login(email: string, password: string): Promise<{ jwt: string; user: UserDto; expires: number }> {
	const userDto = await validateLogin(email, password);
	const tokenExpiresInMillis = 1000 * 60 * 60 * 24;
	const jwtBearerToken = jwt.sign({ userDto }, privKey, {
		algorithm: 'RS256',
		expiresIn: tokenExpiresInMillis,
	});
	const expiringDate = new Date().getTime() + tokenExpiresInMillis;
	return {
		jwt: jwtBearerToken,
		user: userDto,
		expires: expiringDate,
	};
}

/**
 * SignUp()
 *
 * @param user: UserCreateDto
 * @returns
 */
async function signUp(user: UserCreateDto): Promise<boolean> {
	user.role = Roles.user;
	const newUser = await userRepository.createUser(user);
	await sendUnlockUserMail(newUser.firstName, newUser.lastName, newUser.email);
	return true;
}

/**
 * CheckToken()
 *
 * @param token
 * @returns
 */
function checkToken(token: string): UserDto {
	const responseJwt: JwtPayload = jwt.verify(token, privKey, {
		algorithms: ['RS256'],
	}) as JwtPayload;

	if (!responseJwt?.userDto) {
		throw new JwtInvalidError();
	}
	return responseJwt.userDto;
}

/**
 * Refresh Token()
 *
 * @param token
 * @returns
 */
function refreshToken(token: string): { jwt: string; expires: number } {
	const responseJwt = jwt.verify(token, privKey, {
		algorithms: ['RS256'],
	});
	let subject: string = '';
	if (responseJwt.sub) {
		subject = responseJwt.sub.toString();
	}
	const expiresInMillis = 1000 * 60 * 60 * 24;
	const expiringDate = new Date().getTime() + expiresInMillis;

	const jwtBearerToken = jwt.sign({}, privKey, {
		algorithm: 'RS256',
		expiresIn: expiresInMillis,
		subject: subject,
	});

	return {
		jwt: jwtBearerToken,
		expires: expiringDate,
	};
}

async function validateLogin(email: string, password: string): Promise<UserDto> {
	const user = await userRepository.getUser(null, email);
	if (!user) {
		throw new UnknownEmailError(email);
	}
	const pwdPassed = await bcrypt.compare(password, user.password);
	if (!pwdPassed) {
		throw new IncorrectPasswordError();
	}
	return mapUserToUserDto(user);
}





// Export default
export default {
	login,
	signUp,
	checkToken,
	refreshToken,
} as const;
