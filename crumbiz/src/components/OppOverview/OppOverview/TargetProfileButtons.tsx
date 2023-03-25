import React, { useMemo } from 'react';
import Icons from '../../Shared/Icons';
import { useTheme } from '../../../hooks';
import { RoundedIcon } from '../../Shared';
import styled from 'styled-components/native';
import { InteractionTypesEnum, EntityEnum } from '../../../types/enums';
import { sendSpacielInteraction } from '../../../store/actions/oppOverviewActions';
import { useDispatch, useSelector } from 'react-redux';
import { deviceWidth, deviceHeight } from '../../../utils/dimensions';
import Communications from 'react-native-communications';
// import OwnerSideMenu from '../Drawers/OwnerSideMenu';
import { IOppTargetDetails } from '../../../types/interfaces';

interface IProps {
	targetDetails: IOppTargetDetails;
}
const TargetProfileButtons: React.FC<IProps> = ({ targetDetails }) => {
	const {
		oppTargetEmail,
		oppTargetPhone,
		oppTargetUsername,
		oppTargetId
	} = targetDetails;
	// Integration: Please update the userEmail and userPhoneNumber variable w/strings.
	const theme = useTheme();
	const dispatch = useDispatch();

	const buttonInfo = useMemo(() => {
		const modularDispatch = (type: InteractionTypesEnum) => {
			dispatch(
				sendSpacielInteraction({
					targetUsername: oppTargetUsername,
					type,
					targetId: oppTargetId
				})
			);
		};

		return [
			{
				position: { top: -50 },
				icon: Icons.UserHeadIcon,
				isTouchable: true,
				action: () => {}
			},
			{
				position: { left: -5 },
				icon: Icons.TelephoneIcon,
				isTouchable: oppTargetPhone ? true : false,
				action: () => {
					modularDispatch(InteractionTypesEnum.OPEN_CALL);
					Communications.phonecall(oppTargetPhone, true);
				}
			},
			{
				position: { right: -5 },
				icon: Icons.ChatIcon,
				isTouchable: oppTargetPhone ? true : false,
				action: () => {
					modularDispatch(InteractionTypesEnum.OPEN_SMS);
					Communications.text(oppTargetPhone, null);
				}
			},
			{
				position: { top: -50 },
				icon: Icons.MailIcon,
				isTouchable: oppTargetEmail ? true : false,
				action: () => {
					modularDispatch(InteractionTypesEnum.OPEN_EMAIL);
					Communications.email([oppTargetEmail], null, null, null, null);
				}
			}
		];
	}, [oppTargetPhone, oppTargetEmail, oppTargetUsername]);

	return (
		<S.Container>
			{/* <OwnerSideMenu isSideMenuOpen={true} /> */}
			{buttonInfo.map((button, index) => (
				<RoundedIcon
					key={index}
					size={61}
					style={button.position}
					icon={button.icon}
					iconSize={20}
					fill='darkerBlue1'
					backgroundColor={theme.colors.white}
					touchable={button.isTouchable}
					onPress={button.action}
				/>
			))}
		</S.Container>
	);
};

const S: any = {};

S.Container = styled.View`
	width: ${deviceWidth * 0.7};
	flex-direction: row;
	justify-content: space-between;
	align-self: center;
	bottom: ${(deviceHeight * 0.09375) / 5};
`;

export default TargetProfileButtons;
