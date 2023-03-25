import React from 'react';
import styled from 'styled-components/native';
import { TargetStatusesEnum } from '../../types/enums';
import { defaultTheme } from '../../themes';
import IntroStatusCrumb from './OppOverview/IntroStatusCrumb';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { IStyle } from '../../types/interfaces';
import CircleImage from '../Shared/CircleImage';

interface IProps extends IStyle {
	size: number;
	status: TargetStatusesEnum;
	showCrumb?: boolean;
	avatar: string;
	avatarType: string;
	username: string;
	circleWidth?: number;
}

// TODO Yaron - adding Pending and Declined
const introStatusConfigMapper = {
	[TargetStatusesEnum.INTRO]: {
		circleFill: 35,
		circleColor: defaultTheme.colors.lightBlue1
	},
	[TargetStatusesEnum.PENDING]: {
		circleFill: 35,
		circleColor: defaultTheme.colors.lightBlue1
	},
	[TargetStatusesEnum.WE_ARE_GOOD_TO_GO]: {
		circleFill: 67,
		circleColor: defaultTheme.colors.purple1
	},
	[TargetStatusesEnum.MY_PART_IS_DONE]: {
		circleFill: 67,
		circleColor: defaultTheme.colors.purple1
	},
	[TargetStatusesEnum.DONE_DEAL]: {
		circleFill: 100,
		circleColor: defaultTheme.colors.orange
	},
	[TargetStatusesEnum.DELETE_AND_FORGOT]: {
		circleFill: 100,
		circleColor: defaultTheme.colors.orange
	}
};

const ProfileImageWithIntroStatusIndicator: React.FC<IProps> = props => {
	const {
		status,
		avatar,
		avatarType,
		username,
		size,
		style,
		showCrumb,
		circleWidth = 2
	} = props;
	const config = introStatusConfigMapper[status as TargetStatusesEnum];

	return (
		<S.Container style={style}>
			<AnimatedCircularProgress
				padding={1}
				size={size * 1.2}
				width={circleWidth}
				fill={config.circleFill}
				tintColor={config.circleColor}
				duration={0}
				rotation={0}
			>
				{() => (
					<CircleImage
						avatar={avatar}
						avatarType={avatarType}
						username={username}
						size={size}
					/>
				)}
			</AnimatedCircularProgress>

			{showCrumb ? (
				<IntroStatusCrumb status={status} style={{ top: -18 }} />
			) : null}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	align-items: center;
	z-index: 1;
`;

export default ProfileImageWithIntroStatusIndicator;
