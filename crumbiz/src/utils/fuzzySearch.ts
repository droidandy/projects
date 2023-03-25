const fuzzySearch = (term: string, value: string) => {
	const convertedTerm = term.trim().toLowerCase();
	const convertedValue = value.trim().toLowerCase();

	return (
		Boolean(!convertedTerm.length) ||
		new RegExp(convertedTerm, 'g').test(convertedValue)
	);
};

export default fuzzySearch;
