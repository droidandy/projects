interface UserPortfolio {
	firstName?: string;
	lastName?: string;
	avatar?: string;
	avatarType?: string;
}

const defaultUserPortfolio = { firstName: '', lastName: '' };

export const getUserPortfolio = (data: UserPortfolio | string | undefined) => {
	if (!data || typeof data === 'string') return defaultUserPortfolio;

	const { firstName, lastName, avatar, avatarType } = data;
	const username = `${firstName || ''} ${lastName || ''}`;
	return {
		username,
		avatar,
		avatarType
	};
};
