import React, { useMemo, useEffect } from 'react';
import styled from 'styled-components/native';
import CoveringLoadingModal from '../../../components/Shared/CoveringLoadingModal';
import ListItem from '../../../components/Shared/ListItem';
import { FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { crumbizUsersSelector } from '../../../store/selectors/crumbizUsersSelector';

import { IUserData, PlainFunction } from '../../../types/interfaces';
import convertCrumbizItemToSectionItem from './utils/convertCrumbizItemToSectionItem';
import fuzzySearch from '../../../utils/fuzzySearch';
import { getCrumbizUsers } from '../../../store/actions/crumbizUsersActions';
import { useShallowEqualSelector } from '../../../hooks/useShallowEqualSelector';
import { getCrumbizUsersLoadingSelector } from '../../../store/selectors/pendingSelectors';
import Icons from '../Icons';
import { calcWidth, calcHeight, deviceHeight } from '../../../utils/dimensions';
import i18n from '../../../locale/i18n';
import CustomText from '../CustomText';
import MagnetLoader from '../MagnetLoader';

interface IProps {
	onItemPress: PlainFunction;
	searchTerm: string;
}
const CrumbizTab: React.FC<IProps> = ({ onItemPress, searchTerm }) => {
	const { crumbizUsersList } = useSelector(crumbizUsersSelector);
	const crumbizUsersLoading = useShallowEqualSelector(
		getCrumbizUsersLoadingSelector
	);
	const dispatch = useDispatch();
	const _emptyContent = () => {
		return (
			<S.EmptyContentContainer>
				<Icons.EmptyRelationsIcon
					width={calcWidth(150)}
					height={calcHeight(160)}
					style={{ aspectRatio: 1.28 }}
				/>
				<S.NoRelationshipHeader
					text={i18n.t('relationships.noRelationships.headerText')}
				/>
				<S.NoRelationshipText
					text={i18n.t('relationships.noRelationships.text')}
				/>
			</S.EmptyContentContainer>
		);
	};

	useEffect(() => {
		dispatch(getCrumbizUsers());
	}, []);

	let _crumbizUsersList = useMemo(
		() =>
			crumbizUsersList.map((user: IUserData) => {
				return convertCrumbizItemToSectionItem(user);
			}),
		[crumbizUsersList]
	);

	if (searchTerm.trim().length) {
		_crumbizUsersList = _crumbizUsersList.filter((item: any) =>
			fuzzySearch(searchTerm, item.text)
		);
	}

	if (crumbizUsersLoading)
		return <MagnetLoader style={{ marginTop: deviceHeight * 0.05 }} />;
	if (!crumbizUsersList.length) return _emptyContent();
	return (
		<S.Container>
			<FlatList
				data={_crumbizUsersList}
				keyExtractor={(item: any) => item.id}
				bounces={false}
				keyboardShouldPersistTaps='always'
				renderItem={({ item }) => (
					<ListItem
						text={item.text}
						onPress={() => onItemPress(item)}
						icon='initials'
					/>
				)}
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.mainBackgroundColor};
`;

S.EmptyContentContainer = styled.View`
	align-items: center;
	justify-content: center;
	padding-left: ${calcWidth(29)};
	padding-right: ${calcWidth(29)};
`;

S.NoRelationshipHeader = styled(CustomText).attrs({
	size: 's16',
	lineHeight: 23
})`
	margin-top: ${calcHeight(30)};
`;
S.NoRelationshipText = styled(CustomText).attrs({
	color: 'gray15',
	size: 's13',
	lineHeight: 23
})`
	margin-top: ${calcHeight(10)};
	text-align: center;
`;

export default CrumbizTab;
