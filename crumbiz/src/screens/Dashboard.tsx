import React from 'react';
import { useAsyncEffect } from '../hooks';
import { FlatList, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { logoutUser } from '../store/actions/authActions';
import styled from 'styled-components/native';
import { IStackNavigation } from '../types/interfaces';
import { AudioPlayer, CustomText, Typography } from '../components/Shared';
import Button from '../components/Shared/Button';
import AsyncStorage from '@react-native-community/async-storage';
import { getAuthStateSelector } from '../store/selectors/authSelector';
import Login from './Authentication/Login';
import { ScreensEnum } from '../navigation/screens';

interface IProps extends IStackNavigation {}

const Dashboard: React.FC<IProps> = props => {
	const dispatch = useDispatch();
	const { userAuthenticated, userData } = useSelector(getAuthStateSelector);

	useAsyncEffect(async () => {
		const accessToken = await AsyncStorage.getItem('accessToken');
		// dispatch(getUserDetails(accessToken!));
	}, []);

	const APP_SECTIONS = [
		{
			title: ' 2 - Create Opportunity',
			screen: 'CHOOSE_OPPORTUNITY'
		},
		{
			title: ' 4 - Opportunity Overview',
			screen: 'OPP_LISTS'
		},
		{
			title: ' 5 - New Dashboard(Home)',
			screen: 'NEW_DASHBOARD'
		}
	];

	return !userAuthenticated ? (
		<Login navigation={props.navigation} />
	) : (
		<S.Wrapper>
			<S.Header>DASHBOARD</S.Header>
			<S.AuthStatusWrapper>
				<CustomText
					text={`Hello ${userData.firstName && userData.firstName}`}
				/>
				<S.LogoutButton
					onPress={() => {
						dispatch(logoutUser());
					}}
				>
					<Text style={{ color: 'white' }}>Logout</Text>
				</S.LogoutButton>
			</S.AuthStatusWrapper>

			{userData.authId && (
				<FlatList
					showsVerticalScrollIndicator={false}
					data={APP_SECTIONS}
					keyExtractor={(item: any) => item.title}
					renderItem={({ item }) => (
						<S.Button
							text={item.title}
							onPress={() =>
								// @ts-ignore
								props.navigation.navigate(ScreensEnum[item.screen])
							}
						/>
					)}
				/>
			)}
		</S.Wrapper>
	);
};

const S: any = {};
S.Wrapper = styled.View`
	align-items: center;
	margin-bottom: 10;
	padding-bottom: 150;
`;
S.Text = styled.Text`
	color: ${({ theme }) => theme.colors.purple2};
	font-size: 20;
	font-weight: bold;
`;

S.LogoutButton = styled.TouchableOpacity`
	background-color: ${({ theme }) => theme.colors.purple1};
	font-weight: bold;
	padding-horizontal: 10;
	padding-vertical: 10;
	margin-vertical: 15;
	border-radius: 5;
`;

S.Button = styled(Button)`
	margin-top: 15;
	background-color: ${({ theme }) => theme.colors.orange2};
`;

S.Header = styled(Typography.HeaderText)`
	color: ${({ theme }) => theme.colors.orange2};
`;

S.AuthStatusWrapper = styled.View`
	padding-horizontal: 10;
	flex-direction: row;
	width: 80%;
	align-items: center;
	justify-content: space-around;
`;

export default Dashboard;
