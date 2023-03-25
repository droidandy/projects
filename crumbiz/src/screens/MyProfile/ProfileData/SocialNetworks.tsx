import React, { useState, useMemo } from 'react';
import { StatusBar, View, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../../../hooks';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { IStackNavigation, IUserAdditional } from '../../../types/interfaces';
import { deviceWidth, deviceHeight } from '../../../utils/dimensions';
import {
	CustomText,
	Button,
	HeaderMenu,
	Icons
} from '../../../components/Shared';
import { TextInput } from '../../../components/Shared/Form@2.0';
import { getUserAdditionals } from '../../../store/selectors/authSelector';
import { useShallowEqualSelector } from '../../../hooks/useShallowEqualSelector';
import destructUserAdditionals from '../../../utils/destructUserAdditionals';
import {
	updateUserInfo,
	updateUserAdditionalsInfo
} from '../../../store/actions/crumbizUsersActions';
import { useDispatch } from 'react-redux';

const SocialNetworks: React.FC<IStackNavigation> = ({ navigation }) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const userAdditionals: Array<IUserAdditional> = useShallowEqualSelector(
		getUserAdditionals
	);

	console.log(userAdditionals);
	console.log('render');

	//TODO Yaron - extract to Util
	const { linkedIn, twitter, facebook } = useMemo(() => {
		const { linkedIn, twitter, facebook } = destructUserAdditionals(
			userAdditionals
		);
		return { linkedIn, twitter, facebook };
	}, [userAdditionals]);
	const dispatch = useDispatch();

	const [showLinkedin, setShowLinkedin] = useState(!!linkedIn);
	const [linkedinInput, setLinkedinInput] = useState(linkedIn);

	const [showTwitter, setShowTwitter] = useState(!!twitter);
	const [twitterInput, setTwitterInput] = useState(twitter);

	const [showFacebook, setShowFacebook] = useState(!!facebook);
	const [facebookInput, setFacebookInput] = useState(facebook);

	const socialNetworksList = [
		{
			name: t('myProfile.socialNetworks.linkedin'),
			icon: Icons.LinkedIcon,
			iconColor: theme.colors.linkedInButtonColor,
			status: showLinkedin,
			input: linkedinInput,
			onToggle: () => setShowLinkedin(oldState => !oldState),
			onChange: (text: string) => setLinkedinInput(text),
			onClear: () => setLinkedinInput('')
		},
		{
			name: t('myProfile.socialNetworks.twitter'),
			icon: Icons.TwitterIcon,
			iconColor: theme.colors.babyBlue1,
			status: showTwitter,
			input: twitterInput,
			onToggle: () => setShowTwitter(oldState => !oldState),
			onChange: (text: string) => setTwitterInput(text),
			onClear: () => setTwitterInput('')
		},
		{
			name: t('myProfile.socialNetworks.facebook'),
			icon: Icons.FacebookIcon,
			iconColor: theme.colors.facebookButtonColor,
			status: showFacebook,
			input: facebookInput,
			onToggle: () => setShowFacebook(oldState => !oldState),
			onChange: (text: string) => setFacebookInput(text),
			onClear: () => setFacebookInput('')
		}
	];

	return (
		<S.Container>
			<StatusBar backgroundColor={theme.colors.white} barStyle='dark-content' />
			<HeaderMenu leftIcon={{ iconColor: 'black' }} />
			<S.Header bold size='s20' text={t('myProfile.socialNetworks.header')} />

			<View>
				{socialNetworksList.map(network => {
					const { icon: NetworkIcon, status: showInput } = network;
					const clearAndRevert = () => {
						network.onChange('');
						network.onToggle();
					};
					return (
						<>
							<S.Network>
								<S.NetworkDetails
									style={showInput ? { alignItems: 'center' } : null}
								>
									<NetworkIcon
										fill={network.iconColor}
										width={deviceWidth * 0.0555}
										height={deviceHeight * 0.0305625}
									/>
									{!showInput ? (
										<S.NetworkName text={t(network.name)} />
									) : (
										<S.Input
											textSize={14}
											value={network.input}
											onChange={network.onChange}
											textColor={theme.colors.black}
											placeholder={t(
												'myProfile.socialNetworks.inputPlaceholder'
											)}
										/>
									)}
								</S.NetworkDetails>
								{!showInput ? (
									<Button
										textSize={14}
										textAlign='left'
										onPress={network.onToggle}
										width={deviceWidth * 0.15}
										height={deviceHeight * 0.04}
										textColor={theme.colors.darkerBlue1}
										backgroundColor={theme.colors.white}
										text={t('myProfile.socialNetworks.addButton')}
									/>
								) : (
									<Button
										icon={Icons.XIcon}
										onPress={clearAndRevert}
										width={deviceWidth * 0.15}
										height={deviceHeight * 0.05}
										backgroundColor={theme.colors.white}
									/>
								)}
							</S.Network>
							<S.LineContainer>
								<S.Line />
							</S.LineContainer>
						</>
					);
				})}
			</View>
			<Button
				width={deviceWidth}
				backgroundColor='orange'
				text={t('myProfile.mainPage.actionButton')}
				onPress={() => {
					// TODO Yaron - integration
					dispatch(
						updateUserAdditionalsInfo({
							updatedUserAdditionalsKeys: {
								linkedIn: linkedinInput,
								twitter: twitterInput,
								facebook: facebookInput
							}
						})
					);
					navigation.goBack();
				}}
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.white};
`;

S.Header = styled(CustomText)`
	width: 100%;
	margin-bottom: ${deviceHeight * 0.0328125};
	padding-horizontal: ${deviceWidth * 0.0694};
`;

S.Network = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
	padding-horizontal: ${deviceWidth * 0.0694};
	background-color: ${({ theme }) => theme.colors.white};
`;

S.NetworkDetails = styled.View`
	flex-direction: row;
`;

S.NetworkName = styled(CustomText)`
	margin-left: ${deviceWidth * 0.03};
`;

S.Input = styled(TextInput)`
	border-width: 0;
	width: ${deviceWidth * 0.5};
	margin-left: ${deviceWidth * 0.03};
	font-size: ${({ theme }) => theme.fontSizes.s14};
`;

S.XIcon = styled(Icons.XIcon)`
	align-self: center;
`;

S.LineContainer = styled.View`
	flex-direction: row;
	align-items: flex-end;
	height: ${deviceHeight * 0.01875};
	margin-bottom: ${deviceHeight * 0.025};
`;

S.Line = styled.View`
	width: 100%;
	height: ${deviceHeight * 0.0015625};
	background-color: ${({ theme }) => theme.colors.gray12};
`;

export default SocialNetworks;
