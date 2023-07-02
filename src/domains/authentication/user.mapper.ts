import { UserCreateDto, UserDto } from "./user.dto";
import { User } from "./user.entity";

export function mapUserToUserDto(user: User): UserDto {
	const userDto: UserDto = {
		username: user.username,
		email: user.email,
		role: user.role,
		firstName: user.firstName,
		lastName: user.lastName
	}
	return userDto
}

export function mapUserToUserCreateDto(user: User): UserCreateDto {
	const userCreateDto: UserCreateDto = {
		username: user.username,
		email: user.email,
		password: user.password,
		role: user.role,
		firstName: user.firstName,
		lastName: user.lastName
	}
	return userCreateDto
}
