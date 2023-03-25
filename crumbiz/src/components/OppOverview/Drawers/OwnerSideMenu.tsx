import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import SwitchOnAndOff from '../../Shared/SwitchOnAndOff';
import { CustomText, Icons, RoundedIcon } from '../../Shared';
import { StyleSheet, View } from 'react-native';
import {
	deviceWidth,
	calcWidth,
	deviceHeight
} from '../../../utils/dimensions';
import { StateUpdaterFunction } from '../../../types/interfaces';

interface IProps {
	isSideMenuOpen: boolean;
	setOpen: StateUpdaterFunction<boolean>;
}

// Todo Sonya, make text touchable - menuLabelsWithoutSwitch

const OwnerSideMenu: FC<IProps> = props => {
	const { isSideMenuOpen, setOpen } = props;

	// Todo Sonya - use useCallback
	const toggleSideMenu = () => setOpen(oldState => !oldState);

	// FIXME Yaron/Sonya, get data from redux
	const [isOppModeToggled] = useState(false);
	const [isFirstNotificationToggled] = useState(false);
	const [isSecondNotificationToggled] = useState(false);
	const [isThirdNotificationToggled] = useState(false);

	// Todo Sonya, use i18n (locale/en.json)
	const menuLabelsWithoutSwitch = [
		'Delete opp.',
		'Edit opp. details',
		'Transfer opp.'
	];
	const menuLabelsWithSwitch = [
		{ text: 'Lorem Ipsum', status: isFirstNotificationToggled },
		{ text: 'Dolor sit amet', status: isSecondNotificationToggled },
		{ text: 'Consectetur', status: isThirdNotificationToggled }
	];

	return (
		<Modal
			isVisible={isSideMenuOpen}
			onBackdropPress={toggleSideMenu}
			onSwipeComplete={toggleSideMenu}
			animationIn='slideInRight'
			animationOut='slideOutRight'
			swipeDirection='right'
			useNativeDriver
			hideModalContentWhileAnimating
			propagateSwipe
			style={styles.sideMenuStyle}
		>
			<S.SideMenuContainer>
				<S.BackButton onPress={toggleSideMenu}>
					<Icons.ArrowBackWithoutLineIcon
						style={{ transform: [{ rotate: '180deg' }] }}
						height={deviceHeight * 0.033}
					/>
				</S.BackButton>
				<View>
					<CustomText text='Opp. Settings' withBottomGap />

					{menuLabelsWithoutSwitch.map(labelText => (
						<CustomText
							key={labelText}
							text={labelText}
							size='s13'
							color='gray1'
							withBottomGap
						/>
					))}
					<S.SwitchContainer>
						<CustomText
							text='Opp. Mode'
							size='s13'
							color='gray1'
							withBottomGap
						/>
						<SwitchOnAndOff isOn={isOppModeToggled} onToggle={() => {}} />
					</S.SwitchContainer>
				</View>
				<View>
					<CustomText text='Opp. Notifications' withTopGap withBottomGap />
					{menuLabelsWithSwitch.map((label, index) => (
						<S.SwitchContainer key={index}>
							<CustomText
								text={label.text}
								size='s13'
								color='gray1'
								withBottomGap
							/>
							<SwitchOnAndOff isOn={label.status} onToggle={() => {}} />
						</S.SwitchContainer>
					))}
				</View>
			</S.SideMenuContainer>
		</Modal>
	);
};

const styles = StyleSheet.create({
	sideMenuStyle: {
		flex: 1,
		backgroundColor: 'white',
		margin: 0,
		left: deviceWidth * 0.08333333333
	}
});

const S: any = {};
S.BackButton = styled.TouchableOpacity`
	flex-direction: row;
	justify-content: flex-end;
	padding-top: ${deviceHeight * 0.0234375};
	padding-bottom: ${deviceHeight * 0.035};
`;

S.SideMenuContainer = styled.View`
	flex-direction: column;
	width: ${deviceWidth * 0.93};
	padding-horizontal: ${calcWidth(30)};
	background-color: ${({ theme }) => theme.colors.white};
`;

S.SwitchContainer = styled.View`
	flex-direction: row;
	justify-content: space-between;
`;

export default OwnerSideMenu;
