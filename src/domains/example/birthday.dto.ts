
export interface BirthdayDto {
	_id: string;
	oid: string
	firstName: string;
	lastName?: string;
	birthday: string;
	age: number;
}

export interface CreateBirthdayDto {
	oid?: string
	firstName: string;
	lastName?: string;
	birthday: string;
}
