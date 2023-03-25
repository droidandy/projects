import React, { useCallback } from 'react';
import { useTheme } from '../../hooks';
import styled from 'styled-components/native';
import { CustomText, Icons } from '../../components/Shared';
import { TouchableWithoutFeedback, View } from 'react-native';
import { ProfileItemCategoriesEnum } from '../../types/enums';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { ITouchableProps, PlainFunction } from '../../types/interfaces';

export interface ISummaryItem extends ITouchableProps {
	header: string;
  position: number;
  onPress: PlainFunction;
	type: ProfileItemCategoriesEnum;
}

const iconsMapper = {
	[ProfileItemCategoriesEnum.PERSONAL_INFO]: {
		Icon: Icons.UserHeadIcon
	},
	[ProfileItemCategoriesEnum.SOCIAL_NETWORKS]: {
		Icon: Icons.SocialNetworksIcon
	},
	[ProfileItemCategoriesEnum.WORK_EXPERIENCE]: {
		Icon: Icons.BriefcaseIcon
	},
	[ProfileItemCategoriesEnum.ABOUT_ME]: {
		Icon: Icons.ChatOtherWayIcon
	}
};

const ProfileItem: React.FC<ISummaryItem> = props => {
	const theme = useTheme();
	const { header, type, onPress, position } = props;
	const { Icon } = iconsMapper[type];

	const getBackgroundColor = useCallback(position => {
		const _position = position + 1;
		if (_position % 3 === 0) {
			return theme.colors.purple2;
		} else if (_position % 4 === 0) {
			return theme.colors.paleBlue2;
		} else if (_position % 2 === 0) {
			return theme.colors.lightBlue1;
		} else {
			return theme.colors.orange;
		}
	}, []);

	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<S.Container>
				<S.ItemTypeSquare
					style={{ backgroundColor: getBackgroundColor(position) }}
				>
					<Icon
            fill={theme.colors.white}
            width={deviceWidth * 0.05}
            height={deviceHeight * 0.025}
          />
				</S.ItemTypeSquare>
				<View style={{ flex: 1 }}>
					<CustomText bold text={header} size='s14'/>
				</View>
          <Icons.CheckWithoutCircleIcon
            fill={theme.colors.paleBlue2}
            width={deviceWidth * 0.038527}
            height={deviceHeight * 0.01626}
          />
			</S.Container>
		</TouchableWithoutFeedback>
	);
};

const S: any = {};
S.Container = styled.View`
	width: 100%;
  flex-direction: row;
  align-items: center;
  align-items: center;
	background: transparent;
  min-height: ${deviceHeight * 0.06};
  padding-vertical:${deviceHeight * 0.014};
  padding-horizontal: ${deviceWidth * 0.0694};
`;

S.ItemTypeSquare = styled.View`
	aspect-ratio: 1;
	border-radius: 15;
	align-items: center;
	justify-content: center;
	width: ${deviceWidth * 0.113};
	margin-right: ${deviceWidth * 0.04};
`;

export default ProfileItem;