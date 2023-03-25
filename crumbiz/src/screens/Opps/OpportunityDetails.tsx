import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import {
	Button,
	Icons,
	HeaderMenu,
	CustomText,
	CircleImage
} from '../../components/Shared';
import { ScrollView, StatusBar } from 'react-native';
import { IStackNavigation, IUserData } from '../../types/interfaces';
import { useSelector, useDispatch } from 'react-redux';
import {
	submitOpportunity,
	addNewConnector
} from '../../store/actions/createOpportunityActions';
import { createOpportunitySelector } from '../../store/selectors/createOpportunitySelectors';
import OpSummary from '../../components/Shared/OpSummary/OpSummary';
import {
	OpportunityCategoriesEnum,
	EntityEnum,
	ProccessTypeEnum
} from '../../types/enums';
import { convertBudgetNumberToString, fullName } from '../../utils';
import { oppOverviewSelector } from '../../store/selectors/oppOverviewSelector';
import { useTheme } from '../../hooks';
import { OppsScreenHeader } from '../../components/Opps';
import { deviceHeight } from '../../utils/dimensions';
import {
	getUserDataSelector,
	getUserAvatarAndName
} from '../../store/selectors/authSelector';
import { CreateOpportunityTypes } from '../../store/constants';
import withLoading from '../../hoc/withLoading';
import { createLoadingSelector } from '../../store/selectors/pendingSelectors';
import { ScreensEnum } from '../../navigation/screens';
import { entityDetailsSelector } from '../../store/selectors/entitySelector';
import destructUserAdditionals from '../../utils/destructUserAdditionals';

interface IProps extends IStackNavigation {}
const OpportunityDetails: React.FC<IProps> = ({ navigation }) => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const {
		opTitle,
		role,
		businessType,
		verticals,
		provider,
		budget,
		processType,
		opType
	} = useSelector(createOpportunitySelector);
	const entity: IUserData = useSelector(entityDetailsSelector);
	const userDetails = useSelector(getUserAvatarAndName);
	const { oppSummary } = useSelector(oppOverviewSelector);
	const userFullName = fullName(userDetails.firstName, userDetails.lastName);
	const entityFullName = fullName(
		entity?.firstName || '',
		entity?.lastName || ''
	);
	const { avatar: entityAvatar, avatarType: entityAvatarType } = useMemo(
		() => destructUserAdditionals(entity.userAdditionals!),
		[entity]
	);

	const oppTemplateFields = {
		[OpportunityCategoriesEnum.OPP_TYPE]: opType.title,
		[OpportunityCategoriesEnum.TYPE_OF_BUSINESS]: businessType.title,
		[OpportunityCategoriesEnum.SERVICE_PROVIDER]: provider.title,
		[OpportunityCategoriesEnum.BUDGET]: budget,
		[OpportunityCategoriesEnum.VERTICAL]: verticals
	};

	let oppSummaryData = useMemo(() => {
		if (processType === ProccessTypeEnum.ADDING_NEW_CONNECTOR) {
			return oppSummary;
		} else {
			const oppSummaryData = {};
			Object.entries(oppTemplateFields).forEach(([key, value]) => {
				if (key === OpportunityCategoriesEnum.BUDGET && value) {
					//@ts-ignore
					oppSummaryData[key] = convertBudgetNumberToString(value, 1);
					return;
				}
				if (value) {
					//@ts-ignore
					oppSummaryData[key] = value;
				}
			});
			return oppSummaryData;
		}
	}, []);

	const isOwner = role === EntityEnum.OWNER;

	return (
		<S.Container>
			<StatusBar backgroundColor={theme.colors.white} barStyle='dark-content' />
			<ScrollView>
				<HeaderMenu
					leftIcon={{ iconColor: 'black' }}
					rightIcon={{
						iconColor: 'black',
						onPress: () =>
							navigation.navigate(ScreensEnum.DELETE_CREATE_OPP_INFO_MODAL),
						icon: Icons.XIcon
					}}
				/>
				<S.TopPortion>
					<OppsScreenHeader
						pre={t('opps.opDetails.title')}
						header={opTitle}
						alignment='stretch'
						marginTop={0}
						marginBottom={deviceHeight * 0.0468}
						headerMarginTop={deviceHeight * 0.0375}
					/>

					<S.EntityContainer style={{ paddingBottom: deviceHeight * 0.034375 }}>
						<S.IconContainer>
							<CircleImage
								size={61}
								avatar={isOwner ? userDetails.avatar : entityAvatar}
								avatarType={isOwner ? userDetails.avatarType : entityAvatarType}
								username={isOwner ? userFullName : entityFullName}
							/>
						</S.IconContainer>
						<S.EntityDetails>
							<CustomText text={t('opps.selectRole.Initiator')} bold />
							<CustomText text={isOwner ? 'Me' : entityFullName} />
						</S.EntityDetails>
					</S.EntityContainer>

					<S.EntityContainer>
						<S.IconContainer>
							<CircleImage
								size={61}
								avatar={isOwner ? entityAvatar : userDetails.avatar}
								avatarType={isOwner ? entityAvatarType : userDetails.avatarType}
								username={isOwner ? entityFullName : userFullName}
							/>
						</S.IconContainer>
						<S.EntityDetails>
							<CustomText text={t('opps.selectConnector.Connector')} bold />
							<CustomText
								text={role === EntityEnum.CONNECTOR ? 'Me' : entityFullName}
							/>
						</S.EntityDetails>
					</S.EntityContainer>
				</S.TopPortion>

				<S.BottomPortion style={{ paddingBottom: 150 }}>
					<S.BottomTitle
						text='Opportunity Details'
						size='s14'
						color='paleBlue1'
					/>
					<OpSummary
						// @ts-ignore
						data={oppSummaryData}
						trimmed
					/>
				</S.BottomPortion>
			</ScrollView>
			<S.BottomBar />
			<S.FinishButton
				withBottomGap
				text={
					processType === ProccessTypeEnum.CREATING_NEW_OPP
						? 'Finish'
						: 'Add new Connector'
				}
				borderRadius='50px'
				gradientBackground='orange'
				onPress={() => {
					if (processType === ProccessTypeEnum.CREATING_NEW_OPP) {
						dispatch(
							submitOpportunity(() => {
								navigation.dismiss();
							})
						);
					} else {
						dispatch(
							addNewConnector(() => {
								navigation.dismiss();
							})
						);
					}
				}}
			/>
		</S.Container>
	);
};

const S: any = {};

S.Container = styled.View`
	flex: 1;
`;

S.TopPortion = styled.View`
	align-items: center;
	padding-horizontal: 30px;
	margin-bottom: ${deviceHeight * 0.046875};
	background-color: ${({ theme }) => theme.colors.white};
	width: 100%;
`;

S.BottomPortion = styled.View`
	align-items: center;
	padding: 30px;
	margin-bottom: 30px;
	width: 100%;
	background: ${({ theme }) => theme.colors.gray12};
`;

S.EntityContainer = styled.View`
	flex-direction: row;
`;

S.EntityDetails = styled.View`
	margin-left: 26px;
	flex: 1;
	align-items: flex-start;
`;

S.IconContainer = styled.View`
	border-radius: 30.5px;
	background-color: ${props => props.theme.colors.white};
	justify-content: center;
	align-items: center;
`;

S.BottomTitle = styled(CustomText)`
	align-self: flex-start;
`;

S.BottomBar = styled.View`
	width: 100%;
	height: ${deviceHeight * 0.1203125};
	background: ${({ theme }) => theme.colors.gray12};
`;

S.FinishButton = styled(Button)`
	position: absolute;
	bottom: ${deviceHeight * 0.03};
	z-index: 10;
`;

const selectors = [
	createLoadingSelector(CreateOpportunityTypes.SUBMIT_OPPORTUNITY),
	createLoadingSelector(CreateOpportunityTypes.ADD_NEW_CONNECTOR)
];

const selector = (state: any) => selectors.some(s => s(state));

export default withLoading({ selector })(OpportunityDetails);
