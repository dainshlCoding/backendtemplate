import dayjs from "dayjs"
import { Birthday } from "./birthday"
import { BirthdayDto } from "./birthday.dto"


export function mapBirthdayToBirthdayDto(birthday: Birthday): BirthdayDto {
	const birthdayDto: BirthdayDto = {
		_id: birthday._id,
		oid: birthday.oid,
		firstName: birthday.firstName,
		lastName: birthday.lastName,
		birthday: birthday.birthday,
		age: calcAge(birthday.birthday)
	}
	return birthdayDto
}

function calcAge(bday: string): number {
	return dayjs().diff(dayjs(bday), 'year');
}