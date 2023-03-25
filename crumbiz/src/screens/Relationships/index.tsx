import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import { createShadow, extractAvatarFromUser } from '../../utils';
import { Icons, CircleImage, CustomText } from '../../components/Shared';
import { getRelationshipsData } from '../../store/actions/crumbizUsersActions';
import { crumbizUsersSelector } from '../../store/selectors/crumbizUsersSelector';
import { getUserDataSelector } from '../../store/selectors/authSelector';

import i18n from '../../locale/i18n';
import RelationshipItems from './RelationshipItems';
import FilterButton from '../../components/Shared/FilterButton';
import { calcWidth, calcHeight, deviceHeight } from '../../utils/dimensions';
import SideMenu from './SideMenu';
import { useNavigation } from 'react-navigation-hooks';
import CoveringLoadingModal from '../../components/Shared/CoveringLoadingModal';
import { ScreensEnum } from '../../navigation/screens';
import { useNavigationFocus } from '../../hooks';
import { RefreshControl } from 'react-native';

// TODO: figure out how to make flags circled
// TODO: add Crumbiz activity indicator
// TODO: finish filter task & button animation
interface IProps {}

const Relationships: React.FC<IProps> = props => {
	const dispatch = useDispatch();
	const userData = useSelector(getUserDataSelector);
	const { crumbizRelationshipsList: data, isLoading } = useSelector(
		crumbizUsersSelector
	);
	const [showSideMenu, setSideMenu] = useState(false);
	const [filterIndicator, setFilterIndicator] = useState<boolean>(false);
	const navigation = useNavigation();

	useNavigationFocus(() => {
		dispatch(getRelationshipsData());
	});

	useEffect(() => {
		dispatch(getRelationshipsData());
	}, []);

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

	const onPressFilter = () => {
		// setFilterIndicator(!filterIndicator);
		setSideMenu(true);
	};

	const _tabs = () => (
		<>
			<S.BottomHeader>
				<S.NumberRelationships text={`${data.length} Relationships found`} />
				<FilterButton isActive={filterIndicator} onPress={onPressFilter} />
			</S.BottomHeader>
			<RelationshipItems items={data} />
		</>
	);

	const _currentUserProfile = useMemo(() => {
		if (userData) {
			const { firstName, lastName } = userData;
			const [avatar, avatarType] = extractAvatarFromUser(userData);
			return (
				<CircleImage
					avatar={avatar}
					avatarType={avatarType}
					username={`${firstName} ${lastName}`}
					size={48}
				/>
			);
		}
		return null;
	}, [userData]);

	const _renderContent = useMemo(() => {
		return isLoading ? (
			<CoveringLoadingModal absolute={false} visible />
		) : data && data.length ? (
			_tabs()
		) : (
			_emptyContent()
		);
	}, [data, isLoading]);
	return (
		<>
			<SideMenu isSideMenuOpen={showSideMenu} setOpen={setSideMenu} />
			<S.Container
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						enabled
						refreshing={false}
						onRefresh={() => {
							dispatch(getRelationshipsData());
						}}
					/>
				}
			>
				<S.TopPortion>
					<S.Title text='Relationships' />
					<S.ProfileButton
						onPress={() => navigation.navigate(ScreensEnum.MY_PROFILE)}
					>
						{_currentUserProfile}
					</S.ProfileButton>
				</S.TopPortion>
				<S.BottomPortion>{_renderContent}</S.BottomPortion>
			</S.Container>
		</>
	);
};

const S: any = {};

S.EmptyContentContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	margin-top: ${calcHeight(50)};
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

S.Container = styled.ScrollView`
	flex: 1;
	background: white;
`;
S.TopPortion = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-top: ${calcHeight(36)};
	padding-bottom: ${calcHeight(40)};
	padding-horizontal: ${calcWidth(25)};
	margin-bottom: ${deviceHeight * -0.02};
	background-color: ${({ theme }) => theme.colors.gray12};
`;
S.Title = styled(CustomText).attrs({
	size: 's26',
	bold: true
})``;

S.ProfileButton = styled.TouchableOpacity``;

S.BottomPortion = styled.View`
	flex: 1;
	padding-horizontal: ${calcWidth(25)};
	padding-top: ${calcHeight(25)};
	padding-bottom: ${calcHeight(50)};
	border-top-left-radius: 16;
	border-top-right-radius: 16;
	background-color: ${({ theme }) => theme.colors.white};
	${createShadow({ elevation: 20 })}
`;

S.BottomHeader = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

S.NumberRelationships = styled(CustomText).attrs({
	color: 'paleBlue1',
	size: 's12',
	lineHeight: 18
})``;

export default Relationships;
