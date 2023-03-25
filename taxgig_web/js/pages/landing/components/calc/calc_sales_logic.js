import zipCodes from './zipCodes';

export default function calcSales(e) {
	var i = parseInt(e.zipCode, 10), c = parseFloat(e.sales);

	if (!c || !i || -1 === zipCodes.findIndex(function (e) { return e.zipCode === i; }))
		return { ...e, percentage: "0.0%" };

	var n = zipCodes.find(function (e) { return e.zipCode === i; }).percentage,
		z = c * (0.01 * parseInt(n.replace("%", ""), 10));

	return { ...e, percentage: n, z };
}