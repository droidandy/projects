const extractIdFromResponseHeaders = (responseHeaders: any) => {
	const headersEntityId: string = responseHeaders['odata-entityid'];
	const startIndex = headersEntityId.indexOf('(') + 1;
	const endIndex = headersEntityId.indexOf(')');
	return headersEntityId.substring(startIndex, endIndex);
};

export default extractIdFromResponseHeaders;
