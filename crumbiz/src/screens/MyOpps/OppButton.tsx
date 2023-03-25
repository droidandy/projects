import React, { FC } from 'react';
import {
	OpportunityStatusesEnum,
	TargetStatusesEnum,
	EntityEnum
} from '../../types/enums';
import i18n from '../../locale/i18n';
import theme from '../../themes/defaultTheme';
import styled from 'styled-components/native';
import { CustomText } from '../../components/Shared';
import { calcWidth, calcHeight } from '../../utils/dimensions';
import { entityStatusMapper } from '../../components/Shared/ModalAndDropdownContents/Mappers';

type keyMapper = OpportunityStatusesEnum | TargetStatusesEnum;
type mapper = { [key in keyMapper]: { color: string; btnText: string } };

interface IProps {
	roleEntity: EntityEnum;
	status: TargetStatusesEnum | OpportunityStatusesEnum;
}

const OppButton: FC<IProps> = props => {
	const { status } = props;
	const config = entityStatusMapper[status];

	return (
		<S.Container color={config?.color || 'white'}>
			<S.Title text={config?.btnText || ''} />
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View<{ color: string }>`
	border-radius: 25;
	background-color: ${props => props.color};
	padding-horizontal: ${calcWidth(15)};
	padding-vertical: ${calcHeight(5)};
	align-items: center;
	justify-content: center;
`;
S.Title = styled(CustomText).attrs({
	color: 'white',
	size: 's13',
	lineHeight: 20
})``;

export default OppButton;
