import React, { FC, useContext, useRef } from 'react';
import { useTheme } from '../../hooks';
import { LayoutChangeEvent, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import CustomText from './CustomText';
import HeaderMenu from './HeaderMenu';
import PaddingHorizontalContainer from './PaddingHorizontalContainer';
import StatusButton from '../OppOverview/OppOverview/StatusButton';
import {
	IModalAndSlidingDropdownControls,
	PlainFunction
} from '../../types/interfaces';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { EntityEnum, OpportunityStatusesEnum } from '../../types/enums';
import { IColorAndSize } from '../../types/styled';
import { ConnectedBy } from '../OppOverview';
import { OppOverviewContext } from '../../screens/OppOverview/oppOverviewContext';

// Todo Sason/Yonatan - Make GradientHeader agnostic
interface IProps {
	dropdownRef?: React.RefObject<IModalAndSlidingDropdownControls>;
	headerText?: string; // remove?
	oppStatus?: OpportunityStatusesEnum;
	oppTitle: string;
	hideMiddleLine?: boolean;
	setHeaderHeight?: PlainFunction;
	connectedByConfig?: {
		action: EntityEnum;
		titleConfig: IColorAndSize;
		usernameConfig: IColorAndSize;
		connectorProfile: {
			avatar: string;
			avatarType: string;
			connectorUsername: string;
		};
	};
}

const GradientHeader: FC<IProps> = props => {
	const {
		dropdownRef,
		oppStatus,
		oppTitle,
		headerText,
		connectedByConfig,
		hideMiddleLine,
		setHeaderHeight
	} = props;
	const theme = useTheme();
	const headerHeight = useRef(0);
	const { showDrawer, role } = useContext(OppOverviewContext);

	return (
		<S.Gradient
			colors={theme.gradients.blue}
			onLayout={(e: LayoutChangeEvent) => {
				if (typeof setHeaderHeight === 'function') {
					setHeaderHeight(e.nativeEvent.layout.height);
				}
				headerHeight.current = e.nativeEvent.layout.height;
			}}
		>
			<HeaderMenu
				onMiddleLineClick={() => dropdownRef!.current!.open()}
				hideMiddleIcon={hideMiddleLine}
				rightIcon={{
					onPress: () => showDrawer(true)
				}}
			/>

			<S.ContentContainer>
				{/* Todo Yaron/Yonatan - check headertext or optitle */}
				<CustomText
					text={headerText || oppTitle}
					variant='light'
					size='s22'
					bold
				/>
				{connectedByConfig && (
					<S.ConnectedByContainer>
						<ConnectedBy
							action={connectedByConfig.action}
							titleColor={connectedByConfig.titleConfig?.color}
							usernameColor={connectedByConfig.usernameConfig?.color}
							connectorProfile={connectedByConfig.connectorProfile}
							avatarSize={0}
						/>
					</S.ConnectedByContainer>
				)}

				{oppStatus && <S.StatusButton oppStatus={oppStatus} role={role} />}
			</S.ContentContainer>
		</S.Gradient>
	);
};

const S: any = {};

S.Gradient = styled(LinearGradient)`
	width: 100%;
	height: ${deviceHeight * 0.34};
	border-bottom-left-radius: 40;
`;

S.ContentContainer = styled(PaddingHorizontalContainer)`
	width: 100%;
	flex: 1;
	justify-content: space-around;
`;

S.ConnectedByContainer = styled.View`
	justify-content: flex-start;
	align-items: flex-start;
	width: 100%;
	aspect-ratio: 2;
	transform: translateY(${deviceHeight * 0.03}px);
`;

S.OpDetailsLine = styled(View)`
	width: ${deviceWidth * 0.186};
	aspect-ratio: 16.75;
	background: white;
	opacity: 0.2;
	border-radius: 8;
	align-self: center;
`;

S.StatusButton = styled(StatusButton)<{ role: EntityEnum }>`
	transform: translateY(
		${({ role }) => (role === EntityEnum.CONNECTOR ? '-50px' : '0px')}
	);
`;

export default GradientHeader;
