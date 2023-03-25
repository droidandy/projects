import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { IStyle } from '../../types/interfaces';
import CustomText from '../Shared/CustomText';
import CircleImage from '../Shared/CircleImage';
import { deviceWidth } from '../../utils/dimensions';
import { EntityEnum } from '../../types/enums';
import { IColors, IFontSizes } from '../../types/styled';

interface IProps extends IStyle {
	connectorProfile: {
		avatar: string;
		avatarType: string;
		connectorUsername: string;
	};
	showAvatar?: boolean;
	avatarSize: number;
	action?: EntityEnum;
	titleSize?: keyof IFontSizes;
	titleColor?: keyof IColors;
	usernameSize?: keyof IFontSizes;
	usernameColor?: keyof IColors;
	textColumn?: boolean;
}

// TODO ALL - Find different name for this component
const ConnectedBy: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const {
		titleSize = 's12',
		usernameSize = 's12',
		titleColor = 'gray15',
		usernameColor = 'black',
		avatarSize,
		action,
		textColumn
	} = props;
	const { avatar, connectorUsername, avatarType } = props.connectorProfile;

	const text =
		action === EntityEnum.TARGET
			? t('oppOverview.connectedBy')
			: t('oppOverview.createdBy');
	return (
		<S.Container showAvatar={props.showAvatar} style={props.style}>
			{/* Todo Sason - use && */}
			{props.showAvatar ? (
				<S.Image
					avatar={avatar}
					avatarType={avatarType}
					username={connectorUsername}
					size={deviceWidth * avatarSize}
				/>
			) : null}
			<S.TextDetails showAvatar={props.showAvatar} textColumn={textColumn}>
				<CustomText
					style={{ marginRight: props.showAvatar ? 0 : deviceWidth * 0.013 }}
					text={text}
					size={titleSize}
					color={titleColor}
					bold
				/>

				<TouchableOpacity
					onPress={() => {
						// TODO - Redirect to profile page
					}}
				>
					<CustomText
						text={connectorUsername}
						size={usernameSize}
						bold
						color={usernameColor}
					/>
				</TouchableOpacity>
			</S.TextDetails>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View<Partial<IProps>>`
	flex-direction: ${({ showAvatar }) => (showAvatar ? 'row' : 'column')};
	align-items: center;
	justify-content: center;
`;

S.Image = styled(CircleImage)`
	margin-right: ${deviceWidth * 0.027};
`;

S.TextDetails = styled.View<Partial<IProps>>`
	flex-direction: ${({ showAvatar, textColumn }) =>
		showAvatar || textColumn ? 'column' : 'row'};
`;

ConnectedBy.defaultProps = {
	avatarSize: 0.097
};

export default ConnectedBy;
