import React from 'react';
import { IModalAndSlidingDropdownControls, StateUpdaterFunction } from '../../types/interfaces';
import { EntityEnum } from '../../types/enums';

interface IOppOverviewContext {
	oppCompleteModalRef: React.RefObject<IModalAndSlidingDropdownControls>;
	showDrawer: StateUpdaterFunction<boolean>;
	role: EntityEnum | null;
}

export const OppOverviewContext = React.createContext<IOppOverviewContext>({
	oppCompleteModalRef: null as any,
	showDrawer: () => {
	},
	role: null
});
