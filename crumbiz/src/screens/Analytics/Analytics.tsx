import React from 'react';
import styled from 'styled-components/native';
import {
	CustomText,
	Icons,
	PaddingHorizontalContainer
} from '../../components/Shared';
import {
	calcHeight,
	calcWidth,
	deviceWidth,
	deviceHeight,
	calcFontSize
} from '../../utils/dimensions';
import { createShadow } from '../../utils';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../../hooks';

const Analytics: React.FC = () => {
	const theme = useTheme();
	return (
		<S.Container bounces={false}>
			<S.Header>
				<S.HeaderText size='s18' color='gray20' text='Jan 1 - Jan 31, 2020' />
				<Icons.CalenderEmptyIcon
					width={calcWidth(24)}
					height={calcHeight(24)}
					stroke={theme.colors.gray22}
				/>
			</S.Header>
			<PaddingHorizontalContainer>
				<S.FundraiserContainer>
					<S.FundraiserText>
						<View style={{ marginBottom: calcHeight(15) }}>
							<CustomText size='s14' color='white' text='You are' />
							<CustomText bold size='s32' color='white' text='Fundraiser' />
						</View>
						<View>
							<CustomText
								size='s14'
								color='white'
								text='33% total opportunities'
							/>
							<CustomText
								size='s14'
								color='white'
								text='98% success introductions'
							/>
						</View>
					</S.FundraiserText>
					<S.Unicorn width={deviceWidth * 0.43} />
				</S.FundraiserContainer>

				<S.Score>
					<S.Positive>
						<S.ScoreHeader>
							<CustomText bold color='green1' text='Keep it up 👍' />
						</S.ScoreHeader>
						<CustomText bold size='s14' color='gray23' text='Fundraising' />
						<CustomText size='s14' color='gray23' text='on Blockchain' />
						<CustomText size='s14' color='gray23' text='with John Smith' />
					</S.Positive>

					<S.Divider />

					<S.Negative>
						<S.ScoreHeader>
							<CustomText bold color='red1' text='💪 Try to improve' />
						</S.ScoreHeader>
						<CustomText bold size='s14' color='gray23' text='Hiring' />
						<CustomText size='s14' color='gray23' text='33% success' />
						<CustomText size='s14' color='gray23' text='intros' />
					</S.Negative>
				</S.Score>

				<S.OpportunitiesContainer>
					<S.OpportunitiesInfo>
						<S.OpportunitiesText>
							<CustomText size='s24' color='gray20' text='Opportunities' />
							<CustomText size='s24' color='gray22' text=' 88' />
						</S.OpportunitiesText>

						<S.ProgressLabel>
							<CustomText size='s14' color='gray22' text='Successful' />
							<CustomText size='s14' color='gray22' text='In progress' />
						</S.ProgressLabel>

						<S.ProgressBarContainer>
							<S.SuccessfulProgress />
							<S.NotCompletedProgress />
						</S.ProgressBarContainer>

						<CustomText color='gray23' text='Better than 91% of users 🏆' />
					</S.OpportunitiesInfo>

					<Icons.MapIcon width={'100%'} height={calcFontSize(274)} />
				</S.OpportunitiesContainer>

				<S.RelationshipContainer>
					<CustomText color='gray22' text='Relationship' />
					<S.RelationshipInfo>
						<CustomText bold size='s24' color='gray23' text='Gili' />
						<CustomText size='s24' color='gray22' text=' 5' />
					</S.RelationshipInfo>

					<S.RelationshipContributorDetails>
						<CustomText color='gray23' text='Contributor' />
						<S.ContributorBar />
						<CustomText bold color='gray23' text='0' />
					</S.RelationshipContributorDetails>

					<S.RelationshipInitiatorDetails>
						<CustomText color='gray23' text='        Initiator' />
						<S.InitiatorBar />
						<CustomText bold color='gray23' text='0' />
					</S.RelationshipInitiatorDetails>

					<S.RelationshipConnectorDetails>
						<CustomText color='gray23' text='  Connector' />
						<S.ConnectorBar />
						<CustomText bold color='gray23' text='5' />
					</S.RelationshipConnectorDetails>

					<S.GrayBarContainer>
						<S.GrayBar1 />
						<S.GrayBar2 />
						<S.GrayBar3 />
						<S.GrayBar4 />
						<S.GrayBar5 />
					</S.GrayBarContainer>
				</S.RelationshipContainer>

				<S.StayFocusedContainer>
					<CustomText
						bold
						color='green3'
						text='To stay focused, reduce noise ✂️'
					/>
					<View style={{ flexDirection: 'row' }}>
						<CustomText bold size='s14' color='gray23' text='Tal' />
						<CustomText size='s14' color='gray23' text=' as a Connector and ' />
						<CustomText bold size='s14' color='gray23' text='Crypto' />
						<CustomText size='s14' color='gray23' text=' as a vertical' />
					</View>
				</S.StayFocusedContainer>

				<S.RelationshipContainer>
					<CustomText color='gray22' text='Location' />
					<S.RelationshipInfo>
						<CustomText bold size='s24' color='gray23' text='USA' />
						<CustomText size='s24' color='gray22' text=' 7' />
					</S.RelationshipInfo>

					<S.RelationshipContributorDetails>
						<CustomText color='gray23' text='Contributor' />
						<S.ContributorBar />
						<CustomText bold color='gray23' text='0' />
					</S.RelationshipContributorDetails>

					<S.RelationshipInitiatorDetails>
						<CustomText color='gray23' text='        Initiator' />
						<S.OpportunitiesInitiatorBar />
						<CustomText bold color='gray23' text='5' />
					</S.RelationshipInitiatorDetails>

					<S.RelationshipConnectorDetails>
						<CustomText color='gray23' text='  Connector' />
						<S.OpportunitiesConnectorBar />
						<CustomText bold color='gray23' text='2' />
					</S.RelationshipConnectorDetails>

					<S.OppGrayBarContainer>
						<S.OppGrayBar1 />
						<S.OppGrayBar2 />
						<S.OppGrayBar3 />
						<S.OppGrayBar4 />
						<S.OppGrayBar5 />
					</S.OppGrayBarContainer>
				</S.RelationshipContainer>

				<S.TypeContainer>
					<View style={{ paddingHorizontal: calcWidth(16) }}>
						<CustomText bold size='s24' color='gray23' text='Type' />

						<S.FundRaisingContainer>
							<CustomText color='gray23' text='Fundraising' />
							<S.BarContainer>
								<S.FundraisingBar1 />
								<S.FundraisingBar2 />
								<S.FundraisingBar3 />
								<CustomText bold color='gray23' text='  12' lineHeight={17.5} />
							</S.BarContainer>
						</S.FundRaisingContainer>

						<S.BizDevContainer>
							<CustomText color='gray23' text='BizDev' />
							<S.BarContainer>
								<S.BizDevBar1 />
								<S.BizDevBar2 />
								<CustomText bold color='gray23' text='  7' lineHeight={17.5} />
							</S.BarContainer>
						</S.BizDevContainer>

						<S.SponsershipContainer>
							<CustomText color='gray23' text='Sponsership' />
							<S.BarContainer>
								<S.SponsershipBar1 />
								<S.SponsershipBar2 />
								<S.SponsershipBar3 />
								<CustomText bold color='gray23' text='  5' lineHeight={17.5} />
							</S.BarContainer>
						</S.SponsershipContainer>

						<S.HiringContainer>
							<CustomText text='Hiring' />
							<S.BarContainer>
								<S.FundraisingBar1 />
								<CustomText bold color='gray23' text='  2' lineHeight={17.5} />
							</S.BarContainer>
						</S.HiringContainer>
					</View>

					<S.LineContainer>
						<S.Line />
					</S.LineContainer>

					<S.LegendContainer>
						<S.LegendInfoContainer>
							<S.LegendBar1 />
							<CustomText size='s13' color='gray23' text='Contributor' />
						</S.LegendInfoContainer>

						<S.LegendInfoContainer style={{ marginHorizontal: calcWidth(24) }}>
							<S.LegendBar2 />
							<CustomText size='s13' color='gray23' text='Initiator' />
						</S.LegendInfoContainer>

						<S.LegendInfoContainer>
							<S.LegendBar3 />
							<CustomText size='s13' color='gray23' text='Connector' />
						</S.LegendInfoContainer>
					</S.LegendContainer>
				</S.TypeContainer>
			</PaddingHorizontalContainer>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled(ScrollView)`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.gray21};
`;

S.Header = styled.View`
	flex-direction: row;
	align-items: center;
	height: ${calcHeight(56)};
	${createShadow({ elevation: 8 })};
	background-color: ${({ theme }) => theme.colors.white};
`;

S.HeaderText = styled(CustomText)`
	align-self: center;
	padding-top: ${calcHeight(5)};
	margin-right: ${calcWidth(38)};
	margin-left: ${calcWidth(72)};
`;

S.FundraiserContainer = styled.View`
	border-radius: 4;
	align-self: center;
	flex-direction: row;
	margin-top: ${calcHeight(16)};
	${createShadow({ elevation: 8 })};
	background-color: ${({ theme }) => theme.colors.darkerBlue2};
`;

S.FundraiserText = styled.View`
	margin-top: ${calcHeight(20)};
	margin-bottom: ${calcHeight(8)};
	padding-left: ${calcWidth(10)};
`;

S.Unicorn = styled(Icons.UnicornIcon)`
	margin-vertical: ${calcHeight(8)};
`;

S.Score = styled.View`
	border-radius: 4;
	flex-direction: row;
	justify-content: space-between;
	margin-top: ${calcHeight(12)};
	${createShadow({ elevation: 8 })};
	background-color: ${({ theme }) => theme.colors.white};
`;

S.Positive = styled.View`
	padding-left: ${calcWidth(16)};
	padding-vertical: ${calcWidth(16)};
`;

S.Negative = styled.View`
	align-items: flex-end;
	padding-right: ${calcWidth(16)};
	padding-vertical: ${calcWidth(16)};
`;

S.ScoreHeader = styled.View`
	margin-bottom: ${calcHeight(5)};
`;

S.Divider = styled.View`
	width: 1;
	background-color: ${({ theme }) => theme.colors.gray16};
`;

S.OpportunitiesContainer = styled.View`
	border-radius: 4;
	margin-top: ${calcHeight(12)};
	${createShadow({ elevation: 8 })};
	background-color: ${({ theme }) => theme.colors.white};
`;

S.OpportunitiesInfo = styled.View`
	max-width: 100%;
	margin-top: ${calcHeight(28)};
	margin-bottom: ${calcHeight(5)};
	margin-horizontal: ${calcWidth(16)};
`;

S.OpportunitiesText = styled.View`
	flex-direction: row;
`;

S.ProgressLabel = styled.View`
	flex-direction: row;
	justify-content: space-between;
	margin-top: ${calcHeight(14)};
`;

S.ProgressBarContainer = styled.View`
	flex-direction: row;
	margin-bottom: ${calcHeight(16)};
`;

S.SuccessfulProgress = styled.View`
	border-radius: 2.5;
	width: 70%;
	height: ${calcHeight(16)};
	background-color: ${({ theme }) => theme.colors.blue2};
`;

S.NotCompletedProgress = styled.View`
	border-radius: 2.5;
	width: 30%;
	height: ${calcHeight(16)};
	margin-left: ${calcWidth(2)};
	background-color: ${({ theme }) => theme.colors.blue3};
`;

S.OpportunitiesImage = styled.View``;

S.RelationshipContainer = styled.View`
	border-radius: 4;
	padding-top: ${calcHeight(20)};
	${createShadow({ elevation: 8 })};
	padding-horizontal: ${calcWidth(16)};
	margin-vertical: ${calcHeight(12)};
	background-color: ${({ theme }) => theme.colors.white};
`;

S.RelationshipInfo = styled.View`
	flex-direction: row;
	margin-bottom: ${calcHeight(24)};
`;

S.RelationshipContainerDetails = styled.View`
	flex-direction: row;
	align-items: center;
`;

S.RelationshipContributorDetails = styled.View`
	flex-direction: row;
	align-items: center;
`;

S.ContributorBar = styled.View`
	border-radius: 2;
	width: ${calcWidth(8)};
	height: ${calcHeight(40)};
	margin-left: ${calcWidth(24)};
	margin-right: ${calcWidth(8)};
	background-color: ${({ theme }) => theme.colors.blue4};
`;

S.RelationshipInitiator = styled.View`
	margin-vertical: ${calcHeight(8)};
`;

S.RelationshipInitiatorDetails = styled.View`
	flex-direction: row;
	align-items: center;
	margin-vertical: ${calcHeight(8)};
`;

S.InitiatorBar = styled.View`
	border-radius: 2;
	width: ${calcWidth(8)};
	height: ${calcHeight(40)};
	margin-left: ${calcWidth(24)};
	margin-right: ${calcWidth(8)};
	background-color: ${({ theme }) => theme.colors.green2};
`;

S.RelationshipConnector = styled.View`
	margin-bottom: ${calcHeight(32)};
`;

S.RelationshipConnectorDetails = styled.View`
	flex-direction: row;
	align-items: center;
	margin-bottom: ${calcHeight(32)};
`;

S.ConnectorBar = styled.View`
	border-radius: 2;
	width: ${calcWidth(170)};
	height: ${calcHeight(40)};
	margin-left: ${calcWidth(24)};
	margin-right: ${calcWidth(8)};
	background-color: ${({ theme }) => theme.colors.orange3};
`;

S.GrayBarContainer = styled.View`
	flex-direction: row;
	height: ${calcHeight(6)};
	margin-bottom: ${calcWidth(16)};
`;

S.GrayBar1 = styled.View`
	border-radius: 3;
	width: ${calcWidth(86)};
	background-color: ${({ theme }) => theme.colors.gray24};
`;

S.GrayBar2 = styled.View`
	border-radius: 3;
	width: ${calcWidth(84)};
	margin-horizontal: ${calcWidth(4)};
	background-color: ${({ theme }) => theme.colors.gray22};
`;

S.GrayBar3 = styled.View`
	border-radius: 3;
	width: ${calcWidth(53)};
	background-color: ${({ theme }) => theme.colors.gray24};
`;

S.GrayBar4 = styled.View`
	border-radius: 3;
	width: ${calcWidth(50)};
	margin-horizontal: ${calcWidth(4)};
	background-color: ${({ theme }) => theme.colors.gray24};
`;

S.GrayBar5 = styled.View`
	border-radius: 3;
	width: ${calcWidth(23)};
	background-color: ${({ theme }) => theme.colors.gray24};
`;

S.StayFocusedContainer = styled.View`
	border-radius: 4;
	justify-content: space-between;
	${createShadow({ elevation: 8 })};
	padding-vertical: ${calcHeight(16)};
	padding-horizontal: ${calcHeight(16)};
	background-color: ${({ theme }) => theme.colors.white};
`;

S.OpportunitiesInitiatorBar = styled.View`
	border-radius: 2;
	width: ${calcWidth(170)};
	height: ${calcHeight(40)};
	margin-left: ${calcWidth(24)};
	margin-right: ${calcWidth(8)};
	background-color: ${({ theme }) => theme.colors.green2};
`;

S.OpportunitiesConnectorBar = styled.View`
	border-radius: 2;
	width: ${calcWidth(81)};
	height: ${calcHeight(40)};
	margin-left: ${calcWidth(24)};
	margin-right: ${calcWidth(8)};
	background-color: ${({ theme }) => theme.colors.orange3};
`;

S.OppGrayBarContainer = styled.View`
	flex-direction: row;
	height: ${calcHeight(6)};
	margin-bottom: ${calcWidth(16)};
`;

S.OppGrayBar1 = styled.View`
	border-radius: 3;
	width: ${calcWidth(141)};
	background-color: ${({ theme }) => theme.colors.gray22};
`;

S.OppGrayBar2 = styled.View`
	border-radius: 3;
	width: ${calcWidth(76)};
	margin-horizontal: ${calcWidth(4)};
	background-color: ${({ theme }) => theme.colors.gray24};
`;

S.OppGrayBar3 = styled.View`
	border-radius: 3;
	width: ${calcWidth(23)};
	background-color: ${({ theme }) => theme.colors.gray24};
`;

S.OppGrayBar4 = styled.View`
	border-radius: 3;
	width: ${calcWidth(24)};
	margin-horizontal: ${calcWidth(4)};
	background-color: ${({ theme }) => theme.colors.gray24};
`;

S.OppGrayBar5 = styled.View`
	border-radius: 3;
	width: ${calcWidth(23)};
	background-color: ${({ theme }) => theme.colors.gray24};
`;

S.TypeContainer = styled.View`
	border-radius: 4;
	padding-top: ${calcHeight(20)};
	margin-bottom: ${calcHeight(100)};
	${createShadow({ elevation: 8 })};
	background-color: ${({ theme }) => theme.colors.white};
`;

S.FundRaisingContainer = styled.View`
	margin-vertical: ${calcHeight(24)};
`;

S.BizDevContainer = styled.View``;

S.SponsershipContainer = styled.View`
	margin-vertical: ${calcHeight(24)};
`;

S.HiringContainer = styled.View`
	margin-bottom: ${calcHeight(15)};
`;

S.BarContainer = styled.View`
	flex-direction: row;
	height: ${calcHeight(16)};
`;

S.FundraisingBar1 = styled.View`
	border-radius: 3;
	width: ${calcWidth(80)};
	background-color: ${({ theme }) => theme.colors.orange3};
`;

S.FundraisingBar2 = styled.View`
	border-radius: 3;
	width: ${calcWidth(185)};
	margin-horizontal: ${calcWidth(2)};
	background-color: ${({ theme }) => theme.colors.green2};
`;

S.FundraisingBar3 = styled.View`
	border-radius: 3;
	width: ${calcWidth(24)};
	background-color: ${({ theme }) => theme.colors.blue5};
`;

S.BizDevBar1 = styled.View`
	border-radius: 3;
	width: ${calcWidth(65)};
	background-color: ${({ theme }) => theme.colors.orange3};
`;

S.BizDevBar2 = styled.View`
	border-radius: 3;
	width: ${calcWidth(131)};
	margin-horizontal: ${calcWidth(2)};
	background-color: ${({ theme }) => theme.colors.green2};
`;

S.SponsershipBar1 = styled.View`
	border-radius: 3;
	width: ${calcWidth(40)};
	background-color: ${({ theme }) => theme.colors.orange3};
`;

S.SponsershipBar2 = styled.View`
	border-radius: 3;
	width: ${calcWidth(40)};
	margin-horizontal: ${calcWidth(2)};
	background-color: ${({ theme }) => theme.colors.green2};
`;

S.SponsershipBar3 = styled.View`
	border-radius: 3;
	width: ${calcWidth(69)};
	background-color: ${({ theme }) => theme.colors.blue5};
`;

S.LineContainer = styled.View`
	flex-direction: row;
	align-items: flex-end;
	height: ${deviceHeight * 0.01875};
	margin-bottom: ${deviceHeight * 0.01};
`;

S.Line = styled.View`
	width: 100%;
	height: ${deviceHeight * 0.0015625};
	background-color: ${({ theme }) => theme.colors.gray16};
`;

S.LegendContainer = styled.View`
	flex-direction: row;
	justify-content: center;
	margin-bottom: ${calcHeight(5)};
`;

S.LegendInfoContainer = styled.View`
	flex-direction: row;
	align-items: center;
`;

S.LegendBar1 = styled.View`
	border-radius: 2;
	width: ${calcWidth(8)};
	height: ${calcHeight(8)};
	margin-right: ${calcWidth(6)};
	background-color: ${({ theme }) => theme.colors.orange3};
`;

S.LegendBar2 = styled.View`
	border-radius: 2;
	width: ${calcWidth(8)};
	height: ${calcHeight(8)};
	margin-right: ${calcWidth(6)};
	background-color: ${({ theme }) => theme.colors.green2};
`;

S.LegendBar3 = styled.View`
	border-radius: 2;
	width: ${calcWidth(8)};
	height: ${calcHeight(8)};
	margin-right: ${calcWidth(6)};
	background-color: ${({ theme }) => theme.colors.blue5};
`;

export default Analytics;
