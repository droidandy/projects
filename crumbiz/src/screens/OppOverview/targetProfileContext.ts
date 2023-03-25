import React from 'react';
import { IModalAndSlidingDropdownControls, ISubcontentContext } from '../../types/interfaces';

export interface ITargetProfileModals {
	deleteTargetModalRef: React.RefObject<IModalAndSlidingDropdownControls>;
	backTargetToPreviousStepModalRef: React.RefObject<
		IModalAndSlidingDropdownControls
		>;
}

export const TargetProfileContext = React.createContext<ISubcontentContext & ITargetProfileModals>({
	isExpanded: false,
	toggleExpanded: () => {
	},
	scrollViewRef: null,
	profile: {},
	deleteTargetModalRef: null as any,
	backTargetToPreviousStepModalRef: null as any
});
