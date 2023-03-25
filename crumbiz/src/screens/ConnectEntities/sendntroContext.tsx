import React from 'react';
import { ITemplate, StateUpdaterFunction } from '../../types/interfaces';
import { SendIntroModalContentEnum } from './sendIntroEnum';

export const SendIntroContext = React.createContext<{
	setCurrentModalContentType?: StateUpdaterFunction<SendIntroModalContentEnum | null>;
	setCurrentModalContent?: StateUpdaterFunction<ITemplate | null>;
	setModalOpen?: StateUpdaterFunction<boolean>;
}>({});
