import React, { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import { oppOverviewSelector } from '../../../../store/selectors/oppOverviewSelector';
import ProfileRowItem from '../ProfileRowItem';
import {
	PaddingHorizontalContainer,
	Icons,
	CoveringLoadingModal
} from '../../../Shared';
import { ConnectionStatusEnum } from '../../../../types/enums';
import { OpportunityConnectorStatusesEnum } from '../../../../types/enums';
import { IOppConnectorDetails } from '../../../../types/interfaces';
import SectionHeaderText from '../SectionHeader/SectionHeaderText';
import SectionHeader from '../SectionHeader';
import NoDataView from '../NoData/NoDataView';

export interface IConnectorDetails {
	username: string;
	connectorAvatar: string;
	connectorAvatarType: string;
	status: OpportunityConnectorStatusesEnum;
	targetsLength: number;
}
export interface connectorsDetails {
	active: Array<IConnectorDetails>;
	inactive: Array<IConnectorDetails>;
}

interface IProps {}
const ConnectorsTab: React.FC<IProps> = props => {
	const { t } = useTranslation();
	// Todo Sonya, replace && with this constant
	// const shouldDisplayNoDataView =
	const { oppConnectors } = useSelector(oppOverviewSelector);

	const connectorsList: connectorsDetails = {
		active: [],
		inactive: []
	};

	// Order by active / inactive
	oppConnectors.forEach((oppConnector: IOppConnectorDetails) => {
		const connectorDetails = {
			username: oppConnector.oppConnectorUsername,
			connectorAvatar: oppConnector.oppConnectorAvatar,
			connectorAvatarType: oppConnector.oppConnectorAvatarType,
			status: oppConnector.oppConnectorStatus,
			targetsLength: oppConnector.connectorTargetsCount
		};
		if (OpportunityConnectorStatusesEnum.APPROVED) {
			connectorsList.active.push(connectorDetails);
		} else {
			connectorsList.inactive.push(connectorDetails);
		}
	});

	const _render = useMemo(() => {
		return Object.entries(connectorsList).map(([key, profiles]) => {
			if (profiles.length) {
				return (
					<React.Fragment key={key}>
						<SectionHeader>
							<SectionHeaderText
								text={t(`oppOverview.oppOverview.tabs.connectors.${key}`)}
								amount={profiles.length}
							/>
						</SectionHeader>

						{profiles.map((profile: IConnectorDetails, index: number) => (
							<ProfileRowItem key={index} connectorDetails={profile} />
						))}
					</React.Fragment>
				);
			}
		});
	}, []);

	return (
		<S.Container>
			<PaddingHorizontalContainer>
					{_render}
			</PaddingHorizontalContainer>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
`;

export default ConnectorsTab;
