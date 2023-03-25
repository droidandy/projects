import React from 'react';
import {
	OpportunityStatusesEnum,
	TargetStatusesEnum
} from '../../../types/enums';
import i18n from '../../../locale/i18n';
import { IStyle, PlainFunction } from '../../../types/interfaces';
import { Button, Icons } from '../../Shared';
import { deviceHeight, deviceWidth } from '../../../utils/dimensions';
import { IGradients } from '../../../types/styled';
import { useSelector } from 'react-redux';
import { oppOverviewSelector } from '../../../store/selectors/oppOverviewSelector';
import styled from 'styled-components/native';
import useTheme from '../../../hooks/useTheme';

interface IProps extends IStyle {
	statusId: TargetStatusesEnum;
	onPress: PlainFunction<TargetStatusesEnum>;
	showGradientBackground?: boolean;
	targetId: string;
}

export const introStatusConfigMapper = {
	[TargetStatusesEnum.WE_ARE_GOOD_TO_GO]: {
		btnGradient: 'purple',
		btnText: i18n.t('global.introStatus.myPartIsDone')
	},
	[TargetStatusesEnum.MY_PART_IS_DONE]: {
		btnGradient: 'gray2',
		btnText: i18n.t('global.introStatus.myPartIsDone')
	}
};

const MyPartIsDoneButton: React.FC<IProps> = props => {
	const { statusId, style, onPress } = props;
	//@ts-ignore
	const { btnGradient, btnText } = introStatusConfigMapper[statusId];

	const {
		oppDetails: { oppStatus }
	} = useSelector(oppOverviewSelector);

	const theme = useTheme();
	const isDisabled =
		oppStatus === OpportunityStatusesEnum.ON_HOLD ||
		statusId === TargetStatusesEnum.MY_PART_IS_DONE;

	const icon = () => {
		if (statusId !== TargetStatusesEnum.MY_PART_IS_DONE) return null;
		return (
			<Icons.VIcon
				fill={theme.colors['white']}
				height={0.02396 * deviceHeight}
				width={0.058027 * deviceWidth}
			/>
		);
	};

	return (
		<S.Container>
			<Button
				applyRatio
				gradientBackground={
					isDisabled ? 'gray2' : (btnGradient as keyof IGradients)
				}
				onPress={() => {
					onPress();
				}}
				text={btnText}
				style={style}
				rounded
				disabled={isDisabled}
				icon={icon}
				textSize={20}
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View``;

export default MyPartIsDoneButton;
