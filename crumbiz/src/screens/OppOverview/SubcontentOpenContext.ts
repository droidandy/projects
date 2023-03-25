import React from 'react';
import { ISubcontentContext } from '../../types/interfaces';

export const SubcontentOpenContext = React.createContext<ISubcontentContext>({
	isExpanded: false,
	toggleExpanded: () => {
	},
	scrollViewRef: null,
	profile: {}
});
