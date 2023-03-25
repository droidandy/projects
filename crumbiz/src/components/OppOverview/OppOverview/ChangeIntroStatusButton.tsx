import React from 'react';
import {
	OpportunityStatusesEnum,
	TargetStatusesEnum
} from '../../../types/enums';
import i18n from '../../../locale/i18n';
import {
	IOppTargetDetails,
	IStyle,
	PlainFunction
} from '../../../types/interfaces';
import { Button, FadedWhiteGradient } from '../../Shared';
import { IGradients } from '../../../types/styled';
import { changeTargetStatus } from '../../../store/actions/oppOverviewActions';
import { useDispatch, useSelector } from 'react-redux';
import { oppOverviewSelector } from '../../../store/selectors/oppOverviewSelector';
import styled from 'styled-components/native';

interface IProps extends IStyle {
	statusId: TargetStatusesEnum;
	onPress: PlainFunction<TargetStatusesEnum>;
	callback: PlainFunction;
	loading: boolean;
	showGradientBackground?: boolean;
	targetId: string;
	textSize?: number;
}

export const nextStatusMapper = {
	[TargetStatusesEnum.INTRO]: TargetStatusesEnum.WE_ARE_GOOD_TO_GO,
	[TargetStatusesEnum.WE_ARE_GOOD_TO_GO]: TargetStatusesEnum.DONE_DEAL,
	[TargetStatusesEnum.MY_PART_IS_DONE]: TargetStatusesEnum.DONE_DEAL
};

export const introStatusConfigMapper = {
	[TargetStatusesEnum.INTRO]: {
		btnGradient: 'blue',
		btnText: i18n.t('global.introStatus.goodToGo')
	},
	[TargetStatusesEnum.WE_ARE_GOOD_TO_GO]: {
		btnGradient: 'purple',
		btnText: i18n.t('global.introStatus.doneDeal')
	},
	[TargetStatusesEnum.MY_PART_IS_DONE]: {
		btnGradient: 'purple',
		btnText: i18n.t('global.introStatus.doneDeal')
	},
	[TargetStatusesEnum.DONE_DEAL]: {
		btnGradient: 'orange',
		btnText: i18n.t('global.introStatus.doneDeal')
	},
	[TargetStatusesEnum.PENDING]: {
		btnGradient: 'orange',
		btnText: i18n.t('global.introStatus.pending')
	},
	[TargetStatusesEnum.DELETE_AND_FORGOT]: {
		btnGradient: 'white',
		btnText: i18n.t('global.introStatus.declined')
	}
};

const ChangeIntroStatusButton: React.FC<IProps> = props => {
	const {
		statusId,
		onPress,
		targetId,
		style,
		showGradientBackground,
		textSize,
		callback,
		loading
	} = props;
	//@ts-ignore
	const { btnGradient, btnText } = introStatusConfigMapper[statusId];
	const {
		oppDetails: { oppStatus }
	} = useSelector(oppOverviewSelector);
	const dispatch = useDispatch();
	const isDisabled = oppStatus === OpportunityStatusesEnum.ON_HOLD;
	return (
		<S.Container>
			{showGradientBackground && <FadedWhiteGradient />}
			{loading ? (
				<S.Spinner />
			) : (
				<Button
					applyRatio
					gradientBackground={
						isDisabled ? 'gray2' : (btnGradient as keyof IGradients)
					}
					onPress={() => {
						// @ts-ignore
						const newStatus = nextStatusMapper[statusId];
						dispatch(
							changeTargetStatus({
								targetId: targetId,
								newStatus,
								cb: callback
							})
						);
						onPress(newStatus);
					}}
					text={btnText}
					style={style}
					rounded
					disabled={oppStatus === OpportunityStatusesEnum.ON_HOLD}
					textSize={textSize ? textSize : 16}
					gradientProps={{ angle: 270, useAngle: true }}
				/>
			)}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View``;
S.Spinner = styled.ActivityIndicator`
	margin-top: 20;
	justify-content: center;
`;

export default ChangeIntroStatusButton;
