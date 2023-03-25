import React, { FC, useContext, useMemo, useState } from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { useNavigation } from 'react-navigation-hooks';
import { Button, CustomText, Icons } from '../../components/Shared';
import { StyleSheet } from 'react-native';
import { calcFontSize, calcHeight, calcWidth, deviceWidth } from '../../utils/dimensions';
import { StateUpdaterFunction } from '../../types/interfaces';
import I18n from '../../locale/i18n';
import OppTypeMenu from './OppTypeMenu';
import { oppTypeMapper } from '../../components/Shared/ModalAndDropdownContents/Mappers';
import { OpportunityTypesEnum } from '../../types/enums';
import { FilterContext } from './context';

interface IProps {
	isSideMenuOpen: boolean;
	setOpen: StateUpdaterFunction<boolean>;
}

const SideMenu: FC<IProps> = props => {
	const { isSideMenuOpen, setOpen } = props;
	const navigation = useNavigation();
	const toggleSideMenu = () => setOpen(oldState => !oldState);
	const [showOppTypeMenu, setOppTypeMenu] = useState<boolean>(false);
	const { dataByOppType, selectedOppTypes } = useContext(FilterContext);

	const menuConfig = useMemo(() => {
		const selectedTypesKeys =
			selectedOppTypes &&
			Object.keys(selectedOppTypes).filter(type => {
				return selectedOppTypes[type as OpportunityTypesEnum];
			});

		return [
			{
				text: I18n.t('myOpps.sideMenu.filtering.oppType'),
				disabled: false,
				onPress: () => {
					setOppTypeMenu(true);
				},
				selected: selectedTypesKeys?.length
					? selectedTypesKeys
							.map(typeKey => oppTypeMapper[typeKey as OpportunityTypesEnum])
							.join(',')
					: 'All'
			},
			{
				text: I18n.t('myOpps.sideMenu.filtering.status'),
				disabled: false,
				onPress: () => {},
				selected: 'All'
			},
			{
				text: I18n.t('myOpps.sideMenu.filtering.typeServiceProvider'),
				disabled: true,
				onPress: () => {},
				selected: 'All'
			},
			{
				text: I18n.t('myOpps.sideMenu.filtering.budget'),
				disabled: true,
				onPress: () => {},
				selected: 'All'
			},
			{
				text: I18n.t('myOpps.sideMenu.filtering.companyAge'),
				disabled: true,
				onPress: () => {},
				selected: 'All'
			}
		];
	}, [selectedOppTypes]);

	return (
		<>
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

					<S.FilterSection>
						<S.Title text={I18n.t('myOpps.sideMenu.filtering.header')} />
						<S.SearchField
							placeholder={I18n.t('myOpps.sideMenu.filtering.placeholder')}
						></S.SearchField>
						{menuConfig.map((entry, index) => {
							return (
								<React.Fragment key={index}>
									<S.Entry
										disabled={entry.disabled}
										onPress={entry.onPress}
									>
										<S.EntryText
											size='s14'
											lineHeight={19}
											text={entry.text}
											color={entry.disabled ? 'gray17' : 'black'}
										/>
										<S.EntrySelected
											text={entry.selected}
											// {I18n.t('myOpps.sideMenu.filtering.all')}
										/>
									</S.Entry>
									{index !== menuConfig.length - 1 && <S.Divider />}
								</React.Fragment>
							);
						})}
					</S.FilterSection>
				</S.Container>
				<Button
					disabled={false}
					width={deviceWidth}
					borderRadius='0px'
					gradientBackground={'orange'}
					text={I18n.t('myOpps.sideMenu.viewOpps')}
					onPress={toggleSideMenu}
				/>
			</Modal>
			<OppTypeMenu
				toggleParentSideMenu={toggleSideMenu}
				isSideMenuOpen={showOppTypeMenu}
				setOpen={setOppTypeMenu}
			/>
		</>
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
	flex-direction: row;
	justify-content: space-between;
	padding-vertical: ${calcHeight(18)};
`;

S.EntryText = styled(CustomText)``;

S.EntrySelected = styled(CustomText).attrs({
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
