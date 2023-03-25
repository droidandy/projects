import React from 'react';
import { StateUpdaterFunction } from '../../types/interfaces';
import { IOppTypesData } from './index';
import { OpportunityTypesEnum as IOppType } from '../../types/enums';

type selectedOppTypes = { [key in IOppType]: boolean };

export const FilterContext = React.createContext<{
	setSelectedOppTypes?: StateUpdaterFunction<selectedOppTypes>;
	selectedOppTypes?: selectedOppTypes;
	dataByOppType?: IOppTypesData;
	setApplyFilter?: StateUpdaterFunction<boolean>;
}>({});
