const removeHTMLTags = (string: string): string => {
	const regex = /(<([^>]+)>)/gi;
	return string.replace(regex, '');
};

export default removeHTMLTags;
