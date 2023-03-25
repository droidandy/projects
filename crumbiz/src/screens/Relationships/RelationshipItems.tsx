import React, { FC } from 'react';
import styled from 'styled-components/native';
import {
	IUserExpandedWithRelationships,
	IUserAdditionalInfo
} from '../../types/interfaces';
import { TouchableWithoutFeedback, View } from 'react-native';
import { calcWidth, calcHeight } from '../../utils/dimensions';
import { CustomText, Icons, CircleImage } from '../../components/Shared';
import { useNavigation } from 'react-navigation-hooks';
import { useTheme } from '../../hooks';
import { ScreensEnum } from '../../navigation/screens';

const defaultAddinionalInfo: IUserAdditionalInfo = {
	id: '',
	userId: '',
	userGenderId: '',
	birthday: '',
	avatar: '',
	avatarType: '',
	about: '',
	introduction: '',
	stateId: '',
	country: '',
	countryId: '',
	cityId: '',
	linkedIn: '',
	facebook: '',
	twitter: '',
	score: 4
};

interface IProps {
	items: IUserExpandedWithRelationships[];
}

const RelationshipItems: FC<IProps> = props => {
	const { items } = props;
	const navigation = useNavigation();
	const dotSeperator = String.fromCharCode(8226);
	const theme = useTheme();
	const destructAddinitionalInfo = (userAdditionals: IUserAdditionalInfo[]) => {
		const cloned = JSON.parse(JSON.stringify(userAdditionals[0] || {}));
		for (var prop in cloned) if (cloned[prop] == null) delete cloned[prop];
		return { ...defaultAddinionalInfo, ...cloned };
		// return cloned;
	};
	return (
		<S.Container>
			{items.map((user, index) => {
				const {
					id,
					firstName,
					lastName,
					userAdditionals,
					opportunityConnectors,
					opportunityTargets
				} = user;

				const {
					score,
					country,
					countryId,
					avatar,
					avatarType
				} = destructAddinitionalInfo(userAdditionals);

				const userCountry = `${country ? country : 'Earth'}`;
				const flagIconSrc = `https://www.countryflags.io/${countryId}/flat/16.png`;
				const commonOpps =
					opportunityConnectors.length + opportunityTargets.length;
				return (
					<TouchableWithoutFeedback
						key={id}
						onPress={() =>
							navigation.navigate(ScreensEnum.USER_PROFILE, { user })
						}
					>
						<View>
							<S.Item>
								<CircleImage
									style={{ backgroundColor: theme.colors.paleBlue1 }}
									avatar={avatar}
									avatarType={avatarType}
									username={`${firstName} ${lastName}`}
									size={50}
								/>
								<S.UserInfo>
									<S.UserName text={`${firstName} ${lastName}`} />
									<S.Row>
										{countryId ? (
											<S.StateIcon source={{ uri: flagIconSrc }} />
										) : (
											<S.EarthIcon />
										)}
										<S.UserState text={userCountry} />
									</S.Row>
									<S.Row>
										<S.RatingIcon />
										<S.UserScore
											text={`${
												score ? score.toFixed(1) : 0
											} ${dotSeperator} ${commonOpps} Opps in common`}
										/>
									</S.Row>
								</S.UserInfo>
							</S.Item>
							{index !== items.length - 1 && <S.Divider />}
						</View>
					</TouchableWithoutFeedback>
				);
			})}
		</S.Container>
	);
};
const S: any = {};

S.Container = styled.View`
	margin-top: ${calcHeight(4.5)};
`;
S.Item = styled.View`
	height: ${calcHeight(126)};
	padding-vertical: ${calcWidth(25)};
	flex-direction: row;
`;

S.UserInfo = styled.View`
	flex-direction: column;
	margin-left: ${calcWidth(14)};
`;

S.Row = styled.View`
	flex-direction: row;
	align-items: center;
`;

S.UserName = styled(CustomText).attrs({
	size: 's16',
	lineHeight: 23,
	bold: true
})`
	margin-bottom: ${calcHeight(8)};
`;

S.UserState = styled(CustomText).attrs({
	size: 's14',
	lineHeight: 19
})``;

S.StateIcon = styled.Image.attrs({
	resizeMode: 'cover'
})`
	border-radius: 1000;
	width: ${calcWidth(14)};
	height: ${calcHeight(16)};
	margin-right: ${calcWidth(5)};
`;

S.EarthIcon = styled(Icons.GlobeIcon)`
	border-radius: 1000;
	width: ${calcWidth(14)};
	height: ${calcHeight(16)};
	margin-right: ${calcWidth(5)};
`;

S.UserScore = styled(CustomText).attrs({
	size: 's14',
	lineHeight: 19
})``;

S.RatingIcon = styled(Icons.StarIcon).attrs({
	fill: '#fbc638',
	width: calcWidth(14)
})`
	margin-right: ${calcWidth(5)};
	aspect-ratio: 1;
`;
S.Divider = styled.View`
	margin-horizontal: ${calcWidth(-25)};
	height: ${calcHeight(1)};
	background-color: ${({ theme }) => theme.colors.gray12};
`;

export default RelationshipItems;
