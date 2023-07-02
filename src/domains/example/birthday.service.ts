
import { mapBirthdayToBirthdayDto } from './birthday.mapper';
import { Birthday } from './birthday';
import { BirthdayDto, CreateBirthdayDto } from './birthday.dto';
import birthdayRepository from './birthday.repository';
import { DataNotFoundError } from '../../util/errors';

/**
 * Get all birthdays of user.
 *
 * @returns
 */
async function getBirthdays(oid: string): Promise<BirthdayDto[]> {
	const birthdays = await birthdayRepository.getBirthdays(oid);
	if (!birthdays) {
		throw new DataNotFoundError('birthday', oid);
	}
	return birthdays.map((bday: Birthday) => {
		return mapBirthdayToBirthdayDto(bday);
	});
}

/**
 * Create a birthday
 *
 * @returns
 */
async function createBirthday(birthdayDto: CreateBirthdayDto, oid: string): Promise<BirthdayDto> {
	birthdayDto.oid = oid;
	const birthday = await birthdayRepository.createBirthday(birthdayDto);
	return mapBirthdayToBirthdayDto(birthday);
}

/**
 * Update a birthday
 *
 * @returns
 */
async function updateBirthday(birthdayDto: BirthdayDto): Promise<BirthdayDto> {
	const birthday = await birthdayRepository.updateBirthday(birthdayDto);
	return mapBirthdayToBirthdayDto(birthday);
}

/**
 * Delete one birthday
 *
 * @param email
 * @returns
 */
async function deleteBirthday(_id: string): Promise<void> {
	const birthday = await birthdayRepository.deleteBirthday(_id);
	return;
}

export default {
	getBirthdays,
	updateBirthday,
	createBirthday,
	deleteBirthday,
} as const;
