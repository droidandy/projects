import React from 'react';
import styled from 'styled-components/native';
import { TargetStatusesEnum } from '../../../types/enums';
import { defaultTheme } from '../../../themes';
import { deviceHeight, deviceWidth } from '../../../utils/dimensions';
import CustomText from '../../Shared/CustomText';
import { IStyle } from '../../../types/interfaces';

interface IProps extends IStyle {
	status: TargetStatusesEnum;
}

const introStatusConfigMapper = {
	[TargetStatusesEnum.PENDING]: {
		crumbBackground: defaultTheme.colors.orange,
		crumbText: 'Pending'
	},
	[TargetStatusesEnum.INTRO]: {
		crumbBackground: defaultTheme.colors.lightBlue1,
		crumbText: 'Intro.'
	},
	[TargetStatusesEnum.WE_ARE_GOOD_TO_GO]: {
		crumbBackground: defaultTheme.colors.purple1,
		crumbText: "I'm Interested"
	},
	[TargetStatusesEnum.MY_PART_IS_DONE]: {
		crumbBackground: defaultTheme.colors.purple1,
		crumbText: "I'm Interested"
	},
	[TargetStatusesEnum.DONE_DEAL]: {
		crumbBackground: defaultTheme.colors.orange,
		crumbText: "We're on!"
	},
	[TargetStatusesEnum.DELETE_AND_FORGOT]: {
		crumbBackground: defaultTheme.colors.orange,
		crumbText: 'Delete and Forgot'
	}
};

const IntroStatusCrumb: React.FC<IProps> = props => {
	const { status, style } = props;
	//@ts-ignore
	const config = introStatusConfigMapper[status];

	return (
		<S.Container style={[{ backgroundColor: config.crumbBackground }, style]}>
			<CustomText text={config.crumbText} size='s11' variant='light' />
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	padding-horizontal: ${deviceWidth * 0.027};
	padding-vertical: ${deviceHeight * 0.0047};
	align-items: center;
	justify-content: center;
	border-radius: 25px;
`;

export default IntroStatusCrumb;
