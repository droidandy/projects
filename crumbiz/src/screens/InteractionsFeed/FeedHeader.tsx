import React from 'react';
import styled from 'styled-components/native';
import { CircleImage, CustomText, PaddingHorizontalContainer } from '../../components/Shared';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { ISummaryData, IUserData } from '../../types/interfaces';
import { TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { extractAvatarFromUser } from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../hooks';
import { ScreensEnum } from '../../navigation/screens';

interface IProps {
	summary: ISummaryData;
	user: IUserData;
}

const padLeft = (value: number): string => {
	if (value === 0) return '0';
	if (!value) return 'N/A';

	const str = `${value}`;
	return str.padStart(2, '0');
};

const summaryLabels = {
	openOpps: 'Open Opps',
	intros: 'Intros for me',
	pendingIntros: 'Pending intros'
};

const FeedHeader: React.FC<IProps> = props => {
	const theme = useTheme();
	const navigation = useNavigation();
	
	const { user, summary } = props;
	const title = `Hi ${user.firstName}!`;

	const username = `${user.firstName} ${user.lastName}`;
	const [avatar, avatarType] = extractAvatarFromUser(user);

	return (
		<S.Container
			colors={theme.gradients.blue}
			useAngle={true}
			angle={128}
		>
			<S.ContentContainer>
				<S.TopContainer>
					<S.Jumbotron>
						<CustomText text={title} variant='light' size='s26' bold />
						<S.FadedContainer>
							<CustomText
								text='Welcome to Crumbiz'
								variant='light'
								size='s14'
								bold
							/>
						</S.FadedContainer>
					</S.Jumbotron>
					<TouchableWithoutFeedback
						onPress={() => navigation.navigate(ScreensEnum.MY_PROFILE)}
					>
						<S.ImageContainer>
							<CircleImage
								avatar={avatar}
								avatarType={avatarType}
								size={deviceWidth * 0.13333333333}
								username={username}
							/>
						</S.ImageContainer>
					</TouchableWithoutFeedback>
				</S.TopContainer>
				<S.StatsContainer>
					{Object.entries(summary).map(([key, value], index: number) => (
						<React.Fragment key={key}>
							{!!index && <S.StatDivider />}
							<S.StatCell>
								<CustomText
									text={padLeft(value)}
									variant='light'
									size='s32'
									bold
								/>
								<CustomText
									text={summaryLabels[key]}
									variant='light'
									size='s12'
								/>
							</S.StatCell>
						</React.Fragment>
					))}
				</S.StatsContainer>
			</S.ContentContainer>
		</S.Container>
	);
};

const S: any = {};

S.TopContainer = styled.View`
	flex: 1;
	flex-direction: row;
	justify-content: space-between;
`;

S.Jumbotron = styled.View`
	flex: 1;
`;

S.Container = styled(LinearGradient)`
	width: 100%;
	aspect-ratio: 1.63;
	padding-bottom: ${deviceHeight * 0.03};
	padding-top: ${deviceHeight * 0.01};
`;

S.ContentContainer = styled(PaddingHorizontalContainer)`
	width: 100%;
	flex: 1;
	padding-vertical: ${deviceWidth * 0.1};
`;

S.ImageContainer = styled.View``;

S.FadedContainer = styled.View`
	opacity: 0.6;
`;

S.StatsContainer = styled.View`
	flex: 1;
	flex-direction: row;
	justify-content: space-between;
	margin-top: ${deviceWidth * 0.0625};
`;

S.StatCell = styled.View``;

S.StatDivider = styled.View`
	width: 0;
	height: 100%;
	border: 1px solid ${({ theme }) => theme.colors.lightBlue3};
`;
export default FeedHeader;
