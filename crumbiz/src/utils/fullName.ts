const fullName = (firstName: string, lastName: string) =>
	`${firstName} ${lastName}`.replace('null', '');

export default fullName;
