import { Roles } from "../../models/role.enum";
import { User } from "./user.entity";

export interface UserDto {
	username: string;
	email: string;
	role: Roles;
	firstName?: string;
	lastName?: string;

}


export interface UserCreateDto {
	username: string;
	email: string;
	password: string;
	role: Roles;
	firstName: string;
	lastName: string;
}
