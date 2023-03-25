import React, {
	useCallback,
	useMemo,
	useRef,
	useState,
	useContext
} from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { deviceHeight, deviceWidth } from '../../../utils/dimensions';
import { CustomText, Icons } from '../../Shared';
import { useTheme, useContentExpandContext } from '../../../hooks';
import { EntityEnum, TargetStatusesEnum } from '../../../types/enums';
import { BackTargetToPreviousStepModal, DeleteTargetModal } from '../Modals';
import { revertTargetStatus } from '../../../mappers';
import { changeTargetStatus } from '../../../store/actions/oppOverviewActions';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { roleSelector } from '../../../store/selectors/oppOverviewSelector';
import { navigationService } from '../../../services';
import {
	IModalAndSlidingDropdownControls,
	StateUpdaterFunction,
	IOppTargetDetails
} from '../../../types/interfaces';
// @ts-ignore
import ToggleSwitch from 'toggle-switch-react-native';
import { TargetProfileContext } from '../../../screens/OppOverview/targetProfileContext';

interface IProps {
	visible: boolean;
	setVisible: StateUpdaterFunction<boolean>;
}
const TargetProfileThreeDotsMenu: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const theme = useTheme();
	const [shouldGetNotifications, setGetNotifications] = useState(false);
	const { profile }: { profile: IOppTargetDetails } = useContentExpandContext();
	// const backTargetModalRef = useRef<IModalAndSlidingDropdownControls>(null);
	// const deleteTargetModalRef = useRef<IModalAndSlidingDropdownControls>(null);
	const { visible, setVisible } = props;
	const role = useSelector(roleSelector);
	const dispatch = useDispatch();

	const handleDelete = useCallback(() => {
		dispatch(
			changeTargetStatus({
				newStatus: TargetStatusesEnum.DELETE_AND_FORGOT,
				targetId: profile.oppTargetId
			})
		);
		navigationService.goBack();
	}, [profile]);

	const handleGoBack = useCallback(() => {
		if (profile.statusId !== TargetStatusesEnum.INTRO) {
			dispatch(
				changeTargetStatus({
					newStatus: revertTargetStatus[profile.statusId],
					targetId: profile.oppTargetId
				})
			);
		}
	}, [profile.statusId]);

	const { deleteTargetModalRef, backTargetToPreviousStepModalRef } = useContext(
		TargetProfileContext
	);
	const menuItems = useMemo(() => {
		const _dynamicMenuItems = [
			{
				text: t('oppOverview.targetProfile.threeDotsMenu.delete'),
				onPress: () => {
					deleteTargetModalRef.current!.open();
				},
				Icon: Icons.GarbageIcon,
				disabled: role === EntityEnum.CONNECTOR
			},
			{
				text: t('oppOverview.targetProfile.threeDotsMenu.stepBack'),
				onPress: () => {
					if (profile.statusId !== TargetStatusesEnum.INTRO) {
						backTargetToPreviousStepModalRef.current!.open();
					}
				},
				Icon: Icons.PreviousIcon,
				disabled: role === EntityEnum.CONNECTOR
			}
		];
		return _dynamicMenuItems;
	}, [profile.statusId]);

	return (
		<>
			<BackTargetToPreviousStepModal
				handleGoBack={handleGoBack}
				ref={backTargetToPreviousStepModalRef}
				targetStatus={profile.statusId}
			/>
			<DeleteTargetModal
				ref={deleteTargetModalRef}
				handleDelete={handleDelete}
				targetUsername={profile.oppTargetUsername}
			/>

			{visible && (
				<S.Overlay onPress={() => setVisible(false)}>
					<S.OverlayView>
						<S.ThreeDotsMenu>
							<S.MenuItem>
								<CustomText
									size='s14'
									text={t(
										'oppOverview.targetProfile.threeDotsMenu.notifications'
									)}
								/>
								<ToggleSwitch
									isOn={shouldGetNotifications}
									onColor={theme.colors.darkerBlue1}
									offColor={theme.colors.gray16}
									size='small'
									onToggle={() => setGetNotifications(oldState => !oldState)}
								/>
							</S.MenuItem>

							{menuItems.map(({ Icon, text, onPress, disabled }, index) => (
								<TouchableOpacity
									disabled={disabled}
									key={index}
									onPress={() => {
										onPress();
										setVisible(false);
									}}
								>
									<S.MenuItem>
										<CustomText size='s14' text={text} />
										<Icon />
									</S.MenuItem>
								</TouchableOpacity>
							))}
						</S.ThreeDotsMenu>
					</S.OverlayView>
				</S.Overlay>
			)}
		</>
	);
};

const S: any = {};
S.Overlay = styled.TouchableWithoutFeedback``;

S.OverlayView = styled.View`
	width: 100%;
	height: 100%;
	flex: 1;
	position: absolute;
	z-index: 200;
`;
S.ThreeDotsMenu = styled.View`
	width: ${deviceWidth * 0.58888888888};
	background: white;
	position: absolute;
	right: 10px;
	top: 10px;
	border-radius: 7px;
	padding-horizontal: ${deviceWidth * 0.04444444444};
	padding-top: ${deviceHeight * 0.03125};
`;

S.MenuItem = styled.View`
	flex-direction: row;
	margin-bottom: ${deviceHeight * 0.03125};
	justify-content: space-between;
	align-items: center;
`;

export default TargetProfileThreeDotsMenu;
