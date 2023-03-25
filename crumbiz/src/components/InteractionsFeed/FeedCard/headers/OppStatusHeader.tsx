import React from 'react';
import BaseHeader from './BaseHeader';
import { IVInteraction } from '../../../../types/interfaces';
import { StatusButton } from '../../../OppOverview/OppOverview';
import { OpportunityStatusesEnum } from '../../../../types/enums';

interface IProps {
	interaction: IVInteraction;
}

// Scenarios: status, icon, two images, image with status,
const OppStatusHeader: React.FC<IProps> = ({ interaction, ...rest }) => {
	return (
		<BaseHeader interaction={interaction} {...rest}>
			<StatusButton oppStatus={OpportunityStatusesEnum.ON_HOLD} />
		</BaseHeader>
	)
}

export default OppStatusHeader
