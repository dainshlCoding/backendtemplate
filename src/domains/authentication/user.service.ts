
import { UserNotFoundError } from '../../util/errors';
import { mapUserToUserDto } from './user.mapper';
import { UserDto } from './user.dto';
import userRepository from './user.repository';
import { User } from './user.entity';

/**
 * Get a users.
 *
 * @returns
 */
async function getUser(username: string): Promise<UserDto> {
	const user = await userRepository.getUser(username);
	if (!user) {
		throw new UserNotFoundError(username);
	}
	return mapUserToUserDto(user);
}

/**
 * Delete one user
 *
 * @param email
 * @returns
 */
function deleteUser(email: string): Promise<User | null> {
	return userRepository.deleteUser(email);
}

export default {
	getUser,
	deleteUser,
} as const;
