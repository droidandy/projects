import React, { FC, useCallback } from 'react';
import {
	entityNameMapper,
	oppTypeMapper
} from '../../components/Shared/ModalAndDropdownContents/Mappers';
import OppButton from './OppButton';
import { TouchableOpacity } from 'react-native';
import { IOpp, IOppItem } from '../../types/interfaces';
import { calcWidth, calcHeight } from '../../utils/dimensions';
import { CustomText } from '../../components/Shared';
import i18n from '../../locale/i18n';
import {
	EntityEnum,
	OpportunityTypesEnum,
	OpportunityStatusesEnum,
	TargetStatusesEnum,
	OpportunityConnectorStatusesEnum
} from '../../types/enums';
import { getDateFormat } from '../../utils/time';
import styled from 'styled-components/native';
import { useDispatch } from 'react-redux';
import { setSelectedOppAndRole } from '../../store/actions/oppOverviewActions';
import navigationService from '../../services/NavigationService';
import { ScreensEnum } from '../../navigation/screens';

interface IProps {
	data: Array<IOppItem>;
}

const OppsItems: FC<IProps> = props => {
	const { data } = props;
	const dispatch = useDispatch();
	const redirectionHandler = useCallback((redirectionData: IOppItem) => {
		const {
			id: oppId,
			role,
			targetStatusId,
			connectorStatusId
		} = redirectionData;
		dispatch(setSelectedOppAndRole({ oppId, role }));
		const connectorWithPendingOpp =
			role === EntityEnum.CONNECTOR &&
			connectorStatusId === OpportunityConnectorStatusesEnum.PENDING_APPROVAL;
		const targetWithNewopp =
			role === EntityEnum.TARGET &&
			targetStatusId === TargetStatusesEnum.PENDING;
		if (role === EntityEnum.OWNER) {
			navigationService.navigate(ScreensEnum.OPP_OVERVIEW);
		} else if (
			role === EntityEnum.CONNECTOR &&
			!connectorWithPendingOpp &&
			connectorStatusId !== OpportunityConnectorStatusesEnum.DECLINED
		) {
			navigationService.navigate(ScreensEnum.OPP_OVERVIEW);
		} else if (role === EntityEnum.CONNECTOR && connectorWithPendingOpp) {
			navigationService.navigate(ScreensEnum.NEW_OPP);
		} else if (
			role === EntityEnum.TARGET &&
			!targetWithNewopp &&
			targetStatusId !== TargetStatusesEnum.DELETE_AND_FORGOT
		) {
			navigationService.navigate(ScreensEnum.OPP_CRUMB);
		} else if (role === EntityEnum.TARGET && targetWithNewopp) {
			// Target with a new opp
			navigationService.navigate(ScreensEnum.NEW_OPP);
		}
	}, []);
	return (
		<S.Container>
			{data.map((oppItem, index) => {
				const { id, title, opportunityTypeId, role, timestamp } = oppItem;
				const status =
					role === EntityEnum.TARGET
						? oppItem.targetStatusId!
						: oppItem.opportunityStatusId;
				return (
					<TouchableOpacity
						key={id}
						onPress={() => redirectionHandler(oppItem)}
					>
						<S.Item>
							<S.Title text={title} />
							<S.StatusType text={oppTypeMapper[opportunityTypeId]} />
							<S.EntityType
								text={i18n.t('myOpps.oppItems.entityType', {
									type: entityNameMapper[role]
								})}
							/>
							<S.Row>
								<OppButton status={status} roleEntity={role} />
								<S.Time text={getDateFormat(timestamp)} />
							</S.Row>
						</S.Item>
						{index !== data.length - 1 && <S.Divider />}
					</TouchableOpacity>
				);
			})}
		</S.Container>
	);
};
const S: any = {};

S.Container = styled.View`
	margin-top: ${calcHeight(4.5)};
`;

S.Item = styled.View`
	padding-vertical: ${calcHeight(25)};
`;

S.Title = styled(CustomText).attrs({
	size: 's16',
	lineHeight: 23,
	bold: true
})`
	margin-bottom: ${calcHeight(8)};
`;
S.StatusType = styled(CustomText).attrs({
	size: 's14',
	lineHeight: 19
})`
	margin-bottom: ${calcHeight(4)};
`;
S.EntityType = styled(CustomText).attrs({
	size: 's14',
	lineHeight: 19
})``;

S.Time = styled(CustomText).attrs({
	size: 's14',
	lineHeight: 21,
	color: 'gray17'
})``;

S.Row = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-top: ${calcHeight(8)};
`;

S.Divider = styled.View<{ display: boolean }>`
	margin-horizontal: ${calcWidth(-25)};
	height: ${calcHeight(1)};
	background-color: ${({ theme }) => theme.colors.gray12};
`;

export default OppsItems;
