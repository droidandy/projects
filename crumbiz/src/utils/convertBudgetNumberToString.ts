const convertBudgetNumberToString = (budget: number, toFixed: number) => {
	if (budget >= 1000000) return (budget / 1000000).toFixed(toFixed) + 'M';
	return (budget / 1000).toFixed() + 'K';
};

export default convertBudgetNumberToString;
