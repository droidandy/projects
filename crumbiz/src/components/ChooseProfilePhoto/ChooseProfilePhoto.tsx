import React, { useRef, useEffect, useMemo } from 'react';
import { Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { PlainFunction } from '../../types/interfaces';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import CustomText from '../Shared/CustomText';
import { Icons } from '../Shared';
import { useTheme, useCamera } from '../../hooks';
import ChoosePhotoMenuItem from './ChoosePhotoMenuItem';

interface IProps {
	isOpen: boolean;
	close: PlainFunction;
	open: PlainFunction;
	photoSelectionCB: PlainFunction;
	deletePhotoCB: PlainFunction;
}

const ChooseProfilePhoto: React.FC<IProps> = props => {
	const { isOpen, close, photoSelectionCB, deletePhotoCB } = props;
	const animatedOpacity = useRef(new Animated.Value(0)).current;
	const { t } = useTranslation();
	const theme = useTheme();
	const { launchCamera, launchImageLibrary } = useCamera({
		photoSelectionCB: photoSelectionCB
	});

	useEffect(() => {
		Animated.timing(animatedOpacity, {
			toValue: Number(isOpen),
			duration: 300
		}).start();
	}, [isOpen]);

	const menuItems = useMemo(() => {
		const menuList = [
			{
				title: t('chooseProfileImage.gallery'),
				icon: Icons.PhotoLibraryIcon,
				backgroundColor: theme.colors.purple2,
				onPress: launchImageLibrary
			},
			{
				title: t('chooseProfileImage.camera'),
				icon: Icons.CameraIcon,
				backgroundColor: theme.colors.lightBlue2,
				onPress: launchCamera
			},
			{
				title: t('chooseProfileImage.removePhoto'),
				icon: Icons.TrashIcon,
				backgroundColor: theme.colors.orange,
				onPress: deletePhotoCB
			}
		];

		return menuList.map((menuItem, index) => (
			<ChoosePhotoMenuItem {...menuItem} size={59} iconSize={25} key={index} />
		));
	}, []);

	return (
		<>
			<S.Container onPress={close}>
				<S.AnimatedOverlay
					isOpen={isOpen}
					style={{
						opacity: animatedOpacity
					}}
				>
					<S.BottomPortionContainer>
						<S.MenuHeader
							size='s26'
							text={t('chooseProfileImage.title')}
							color='white'
						/>
						<S.MenuContainer>{menuItems}</S.MenuContainer>
					</S.BottomPortionContainer>
				</S.AnimatedOverlay>
			</S.Container>
		</>
	);
};

const S: any = {};

S.Container = styled.TouchableWithoutFeedback``;

S.AnimatedOverlay = styled(Animated.View)`
	background-color: ${({ theme }) => theme.colors.darkerBlackOpacity};
	position: absolute;
	width: ${({ isOpen }) => (isOpen ? '100%' : '0')};
	height: 100%;
`;

S.BottomPortionContainer = styled.View`
	position: absolute;
	bottom: 0;
	z-index: 10000;
	height: ${deviceHeight * 0.28};
	width: 100%;
	justify-content: space-between;
`;

S.MenuHeader = styled(CustomText)`
	margin-left: ${deviceWidth * 0.07};
`;

S.MenuContainer = styled.View`
	background-color: ${({ theme }) => theme.colors.gray25};
	border-top-left-radius: 28;
	border-top-right-radius: 28;
	height: ${deviceHeight * 0.185};
	flex-direction: row;
	justify-content: space-around;
`;

export default ChooseProfilePhoto;
