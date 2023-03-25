const extractInitials = (text?: string): string => {
	if (!text) return '';

	let initials = '';
	const [firstWord, secondWord] = text.split(' ');

	if (firstWord && firstWord.length) {
		initials += firstWord[0];
	}

	if (secondWord && secondWord.length) {
		initials += secondWord[0];
	}

	return initials.toUpperCase();
};

export default extractInitials;
