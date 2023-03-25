import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { useNavigation } from 'react-navigation-hooks';
import { CustomText, Icons, Button } from '../../components/Shared';
import { StyleSheet, View } from 'react-native';
import {
	deviceWidth,
	calcWidth,
	calcHeight,
	calcFontSize
} from '../../utils/dimensions';
import { StateUpdaterFunction } from '../../types/interfaces';
import I18n from '../../locale/i18n';
import { ScreensEnum } from '../../navigation/screens';
interface IProps {
	isSideMenuOpen: boolean;
	setOpen: StateUpdaterFunction<boolean>;
}

const SideMenu: FC<IProps> = props => {
	const { isSideMenuOpen, setOpen } = props;
	const navigation = useNavigation();
	const toggleSideMenu = () => setOpen(oldState => !oldState);

	const [isOppModeToggled] = useState(false);

	const sortGlossary = [
		{
			text: I18n.t('relationships.sideMenu.sorting.mostRecommended'),
			isActive: false
		},
		{
			text: I18n.t('relationships.sideMenu.sorting.mostPopular'),
			isActive: false
		},
		{
			text: I18n.t('relationships.sideMenu.sorting.theNewest'),
			isActive: true
		}
	];

	const filterGlossary = [
		{
			text: I18n.t('relationships.sideMenu.filtering.oppType')
		},
		{
			text: I18n.t('relationships.sideMenu.filtering.location')
		}
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
			<S.Container>
				<S.BackButton onPress={toggleSideMenu}>
					<Icons.ArrowBackScreen width='100%' height='100%' />
				</S.BackButton>
				<S.SortingSection>
					<S.Title text={I18n.t('relationships.sideMenu.sorting.header')} />
					{sortGlossary.map((entry, index) => (
						<View key={index + entry.text}>
							<S.Entry disabled={!entry.isActive}>
								<S.EntryText
									size='s14'
									lineHeight={19}
									text={entry.text}
									color={entry.isActive ? 'black' : 'gray17'}
								/>
							</S.Entry>
							<S.Divider />
						</View>
					))}
				</S.SortingSection>
				<S.FilterSection>
					<S.Title text={I18n.t('relationships.sideMenu.filtering.header')} />
					<S.SearchField
						placeholder={I18n.t('relationships.sideMenu.filtering.placeholder')}
					></S.SearchField>
					{filterGlossary.map((entry, index) => (
						<View key={index + entry.text}>
							<S.Entry>
								<S.EntryText size='s14' lineHeight={19} text={entry.text} />
								<S.EntryStatus text={I18n.t('myOpps.sideMenu.filtering.all')} />
							</S.Entry>
							{index !== filterGlossary.length - 1 && <S.Divider />}
						</View>
					))}
				</S.FilterSection>
			</S.Container>
			<Button
				disabled={false}
				width={deviceWidth}
				borderRadius='0px'
				gradientBackground={'orange'}
				text={I18n.t('relationships.sideMenu.viewContacts')}
				onPress={() => navigation.navigate(ScreensEnum.RELATIONSHIPS)}
			/>
		</Modal>
	);
};

const styles = StyleSheet.create({
	sideMenuStyle: {
		flex: 1,
		backgroundColor: 'white',
		margin: 0
	}
});

const S: any = {};

S.Container = styled.View`
	flex: 1;
	flex-direction: column;
	padding-horizontal: ${calcWidth(25)};
	padding-top: ${calcWidth(23)};
`;

S.BackButton = styled.TouchableOpacity`
	flex-direction: row;
	width: ${calcWidth(8)};
	aspect-ratio: 0.57;
`;
S.SortingSection = styled.View`
	margin-top: ${calcHeight(30)};
`;
S.FilterSection = styled.View`
	margin-top: ${calcHeight(40)};
`;

S.Title = styled(CustomText).attrs({
	size: 's20',
	lineHeight: 23,
	bold: true
})``;
S.Entry = styled.TouchableOpacity`
	padding-vertical: ${calcHeight(18)};
	flex-direction: row;
	justify-content: space-between;
`;

S.EntryText = styled(CustomText)<{ disabled: boolean }>`
	color: ${props => (props.disabled ? 'gray15' : 'black')};
`;
S.EntryStatus = styled(CustomText).attrs({
	size: 's14',
	lineHeight: 23,
	color: 'gray15'
})``;
S.SearchField = styled.TextInput.attrs(props => {
	placeholderTextColor: props.theme.colors.gray17;
})`
	padding: 0;
	margin: 0;
	margin-top: ${calcHeight(25)};
	padding-bottom: ${calcHeight(8)};
	line-height: ${calcFontSize(23)};
	font-size: ${calcFontSize(14)};
	border-color: ${({ theme }) => theme.colors.gray16};
	border-bottom-width: ${calcHeight(1)};
`;

S.Divider = styled.View`
	height: ${calcHeight(1)};
	margin-horizontal: ${calcWidth(-25)};
	width: ${deviceWidth};
	background-color: ${({ theme }) => theme.colors.gray12};
`;

export default SideMenu;
