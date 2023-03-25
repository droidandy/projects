import React from 'react';

export default (...hocs: Array<Function>) => (WrappedComponent: React.FC<any>) => {
	return hocs.reduce((WIPComponent, hoc) => {
		return hoc(WIPComponent);
	}, WrappedComponent);
}
