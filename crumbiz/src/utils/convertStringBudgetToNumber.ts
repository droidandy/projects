const convertStringBudgetToNumber = (budgetTitle: string) => {
	let budgetNumber = null;
	if (budgetTitle.includes('M')) {
		budgetNumber = parseInt(budgetTitle) * 1000000;
	}
	if (budgetTitle.includes('K')) {
		budgetNumber = parseInt(budgetTitle) * 1000;
	}

	return budgetNumber;
};

export default convertStringBudgetToNumber;
