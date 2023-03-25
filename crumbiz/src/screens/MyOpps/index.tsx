import React, { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOpps } from '../../store/actions/myOppsActions';
import { getUserDataSelector } from '../../store/selectors/authSelector';
import { oppsSelector } from '../../store/selectors/oppsSelector';
import { CircleImage, CustomText } from '../../components/Shared';
import { createShadow, extractAvatarFromUser } from '../../utils';
import { calcHeight, calcWidth, deviceHeight } from '../../utils/dimensions';
import i18n from '../../locale/i18n';
import OppsItems from './OppsItems';
import FilterButton from '../Relationships/FilterButton';
import CoveringLoadingModal from '../../components/Shared/CoveringLoadingModal';
import { IOppItem, IStackNavigation } from '../../types/interfaces';
import SideMenu from './SideMenu';
import {
	EntityEnum,
	OpportunityStatusesEnum,
	OpportunityTypesEnum as IOppType,
	TargetStatusesEnum
} from '../../types/enums';
import EmptyPage from './EmptyPage';
import styled from 'styled-components/native';
import { useNavigation } from 'react-navigation-hooks';
import { ScreensEnum } from '../../navigation/screens';
import { FilterContext } from './context';
import { useNavigationFocus } from '../../hooks';
import { RefreshControl } from 'react-native';

interface IProps extends IStackNavigation {}

export type IOppTypesData = { [key in IOppType]: IOppItem[] };
export type IOppStatusData = {
	[key in OpportunityStatusesEnum | TargetStatusesEnum]: IOppItem[];
};

const MyOpps: FC<IProps> = props => {
	const dispatch = useDispatch();
	const userData = useSelector(getUserDataSelector);
	const { opps, isLoading } = useSelector(oppsSelector);
	const [showSideMenu, setSideMenu] = useState(false);
	const [applyFilter, setApplyFilter] = useState<boolean>(false);
	const navigation = useNavigation();

	useNavigationFocus(() => {
		dispatch(getMyOpps(userData.id!));
	});

	useEffect(() => {
		dispatch(getMyOpps(userData.id!));
	}, []);

	const [selectedOppTypes, setSelectedOppTypes] = useState({
		[IOppType.HIRING]: false,
		[IOppType.SERVICE_PROVIDER]: false,
		[IOppType.FUNDRAISING]: false,
		[IOppType.BUSINESS_DEVELOPMENT]: false
	});

	const dataByOppType = useMemo(() => {
		if (opps && opps.length)
			return opps.reduce((prev, opp) => {
				if (!prev[opp.opportunityTypeId]) {
					prev[opp.opportunityTypeId] = [];
				}
				prev[opp.opportunityTypeId].push(opp);
				return prev;
			}, {} as IOppTypesData);
	}, [opps]);

	const dataByOppStatus = useMemo(() => {
		return opps.reduce((prev, opp) => {
			const statusId =
				opp.role === EntityEnum.TARGET
					? opp.targetStatusId!
					: opp.opportunityStatusId;
			if (!prev[statusId]) {
				prev[statusId] = [];
			}
			prev[statusId].push(opp);
			return prev;
		}, {} as IOppStatusData);
	}, []);

	const _tabs = (data: Array<IOppItem>) => (
		<>
			<S.BottomHeader>
				<S.NumberRelationships
					text={i18n.t('myOpps.numberOppsFound', {
						number: data.length
					})}
				/>
				<FilterButton
					isActive={true}
					onPress={() => {
						setSideMenu(true);
					}}
				/>
			</S.BottomHeader>
			<OppsItems data={data} />
		</>
	);

	const _currentUserProfile = useMemo(() => {
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
	}, [userData]);

	const _renderContent = useMemo(() => {
		return isLoading ? (
			<CoveringLoadingModal absolute={false} visible />
		) : opps && opps.length ? (
			_tabs(opps)
		) : (
			<EmptyPage
				title={i18n.t('myOpps.noOpps.headerText')}
				text={i18n.t('myOpps.noOpps.text')}
			/>
		);
	}, [opps, isLoading]);

	return (
		<>
			<FilterContext.Provider
				value={{
					setSelectedOppTypes,
					selectedOppTypes,
					dataByOppType,
					setApplyFilter
				}}
			>
				<SideMenu isSideMenuOpen={showSideMenu} setOpen={setSideMenu} />
			</FilterContext.Provider>
			<S.Container
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						enabled
						refreshing={false}
						onRefresh={() => {
							dispatch(getMyOpps(userData.id!));
						}}
					/>
				}
			>
				<S.TopPortion>
					<S.Title text={i18n.t('myOpps.title')} />
					<S.ProfileButton
						onPress={() => navigation.navigate(ScreensEnum.MY_PROFILE)}
					>
						{userData && _currentUserProfile}
					</S.ProfileButton>
				</S.TopPortion>
				<S.BottomPortion>{_renderContent}</S.BottomPortion>
			</S.Container>
		</>
	);
};

const S: any = {};

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

export default MyOpps;
// const statusTypeData = useMemo(() => {
// 	if (opps && opps.length) {
// 		const res = opps.reduce((prev, opp) => {
// 			const statusId =
// 				opp.role === EntityEnum.TARGET
// 					? opp.targetStatusId!
// 					: opp.opportunityStatusId;
// 			// const status = entityStatusMapper[statusId];
// 			if (prev[statusId] === undefined) {
// 				prev[statusId] = [];
// 			}
// 			prev[statusId].push(opp);
// 			return prev;
// 		}, {});

// 		return res;
// 	}
// 	return {};
// }, [opps]);

// const FilteredOpps = useMemo(() => {
// 	const res: Array<IOppItem> = [];
// 	const filterIndicator = Object.values(filterOppTypeState).findIndex(
// 		item => item
// 	);
// 	if (applyFilter) {
// 		if (filterIndicator > -1 && oppTypes) {
// 			const selectedTypes = Object.entries(filterOppTypeState)
// 				.filter((type, isSelected) => {
// 					return isSelected;
// 				})
// 				.keys();
// 			console.warn(selectedTypes);
// 			// if (filterOppTypeState[IOppType.HIRING]) {
// 			// 	res.push(...oppTypes[IOppType.HIRING]);
// 			// }
// 			// if (filterOppTypeState[IOppType.FUNDRAISING]) {
// 			// 	res.push(...oppTypes[IOppType.FUNDRAISING]);
// 			// }
// 			// if (filterOppTypeState[IOppType.BUSINESS_DEVELOPMENT]) {
// 			// 	res.push(...oppTypes[IOppType.BUSINESS_DEVELOPMENT]);
// 			// }
// 			// if (filterOppTypeState[IOppType.SERVICE_PROVIDER]) {
// 			// 	res.push(...oppTypes[IOppType.SERVICE_PROVIDER]);
// 			// }
// 			return res;
// 		}
// 		// setApplyFilter(false);
// 	}
// 	return res;
// }, [applyFilter]);

// const filteredOpps = useMemo(() => {
// 	let res: Array<IOppItem> = [];
// 	if (filterOppTypeState[IOppType.HIRING]) {
// 		res.push(oppTypes[IOppType.HIRING]);
// 	}
// 	if (filterOppTypeState[IOppType.FUNDRAISING]) {
// 		res.push(oppTypes[IOppType.FUNDRAISING]);
// 	}
// 	if (filterOppTypeState[IOppType.BUSINESS_DEVELOPMENT]) {
// 		res.push(oppTypes[IOppType.BUSINESS_DEVELOPMENT]);
// 	}
// 	if (filterOppTypeState[IOppType.SERVICE_PROVIDER]) {
// 		res.push(oppTypes[IOppType.SERVICE_PROVIDER]);
// 	}
// 	return res;
// }, [{ ...filterOppTypeState }]);
