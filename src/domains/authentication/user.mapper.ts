import { UserCreateDto, UserDto } from "./user.dto";
import { User } from "./user.entity";

export function mapUserToUserDto(user: User): UserDto {
	const userDto: UserDto = {
		_id: user._id,
		username: user.username,
		email: user.email,
		role: user.role,
		firstName: user.firstName,
		lastName: user.lastName
	}
	return userDto
}
