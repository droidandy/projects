import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { TargetStatusesEnum, EntityEnum } from '../../../../../types/enums';
import { Icons, PaddingHorizontalContainer } from '../../../../Shared';
import { useSelector } from 'react-redux';
import {
	oppOverviewSelector,
	IOppOverViewSelector
} from '../../../../../store/selectors/oppOverviewSelector';
import HorizontalProfilesList from './HorizontalList/HorizontalProfilesList';
import VerticalProfilesList from './VerticalList/VerticalProfilesList';
import { deviceWidth } from '../../../../../utils/dimensions';
import { TouchableOpacity } from 'react-native';
import SectionHeader, { SectionHeaderText } from '../../SectionHeader';
import NoDataView from '../../NoData/NoDataView';
import { useTheme } from '../../../../../hooks';
import { PlainFunction } from '../../../../../types/interfaces';

interface IProps {
	handleOppOverviewRefresh: PlainFunction;
}

enum ListTypeEnum {
	VERTICAL,
	HORIZONTAL
}

const TargetsTab: React.FC<IProps> = ({ handleOppOverviewRefresh }) => {
	const { t } = useTranslation();
	const { role, oppTargets }: IOppOverViewSelector = useSelector(
		oppOverviewSelector
	);
	const [listType, setListType] = useState(ListTypeEnum.HORIZONTAL);

	useEffect(() => {
		if (role === EntityEnum.CONNECTOR) {
			setListType(ListTypeEnum.VERTICAL);
		}
	}, []);

	const iconsOpacityMapper = {
		cardsIcon: listType === ListTypeEnum.HORIZONTAL ? 1 : 0.5,
		listIcon: listType === ListTypeEnum.VERTICAL ? 1 : 0.5
	};

	const translationMapper = t(
		`oppOverview.oppOverview.tabs.targets.${
			listType === ListTypeEnum.HORIZONTAL ? 'allTargets' : 'active'
		}`
	);

	// Todo Yaron - before inserting the data to redux, filter them
	// Filtering targets with Pending | Deleted statuses
	const filteredOppTargets = useMemo(
		() =>
			oppTargets.filter(
				target =>
					target.statusId !== TargetStatusesEnum.DELETE_AND_FORGOT &&
					target.statusId !== TargetStatusesEnum.PENDING
			),
		[oppTargets]
	);
	const theme = useTheme();

	const _render = useMemo(() => {
		if (!filteredOppTargets.length) {
			return (
				<NoDataView
					icon={
						role === EntityEnum.OWNER
							? Icons.NoContributorsIcon
							: Icons.AddContributorsIcon
					}
					title={t('oppOverview.oppOverview.noDataView.forTargets.headerText')}
					description={t('oppOverview.oppOverview.noDataView.forTargets.text')}
				/>
			);
		}

		return (
			<PaddingHorizontalContainer>
				<SectionHeader>
					<SectionHeaderText
						text={translationMapper}
						amount={filteredOppTargets.length}
					/>

					{role !== EntityEnum.CONNECTOR && (
						<View style={{ flexDirection: 'row', alignSelf: 'center' }}>
							<TouchableOpacity
								onPress={() => setListType(ListTypeEnum.HORIZONTAL)}
							>
								<Icons.CardsIcon
									style={{
										opacity: iconsOpacityMapper.cardsIcon
									}}
								/>
							</TouchableOpacity>

							<S.IconsDivider />

							<TouchableOpacity
								onPress={() => setListType(ListTypeEnum.VERTICAL)}
							>
								<Icons.ListIcon
									style={{
										opacity: iconsOpacityMapper.listIcon,
										height: deviceWidth * 0.043,
										width: deviceWidth * 0.043
									}}
									fill={theme.colors.darkerBlue1}
								/>
							</TouchableOpacity>
						</View>
					)}
				</SectionHeader>

				{listType === ListTypeEnum.HORIZONTAL ? (
					<HorizontalProfilesList
						targets={filteredOppTargets}
						handleOppOverviewRefresh={handleOppOverviewRefresh}
					/>
				) : (
					<VerticalProfilesList targets={filteredOppTargets} />
				)}
			</PaddingHorizontalContainer>
		);
	}, [filteredOppTargets, listType, setListType]);

	return <S.Container>{_render}</S.Container>;
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.white};
`;

S.Header = styled.View`
	flex-direction: row;
	justify-content: space-between;
`;

S.IconsDivider = styled.View`
	margin-right: ${deviceWidth * 0.0416};
`;

export default TargetsTab;
