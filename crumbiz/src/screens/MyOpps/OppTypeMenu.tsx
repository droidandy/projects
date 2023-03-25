import React, { FC, useContext, useMemo } from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { CustomText, Icons, Button } from '../../components/Shared';
import { StyleSheet } from 'react-native';
import { deviceWidth, calcWidth, calcHeight } from '../../utils/dimensions';
import { StateUpdaterFunction, IOppItem } from '../../types/interfaces';
import I18n from '../../locale/i18n';
import { OpportunityTypesEnum as IOppType } from '../../types/enums';
import { FilterContext } from './context';

interface IProps {
	isSideMenuOpen: boolean;
	setOpen: StateUpdaterFunction<boolean>;
	toggleParentSideMenu: () => void;
}

const OppTypeMenu: FC<IProps> = props => {
	const { isSideMenuOpen, setOpen, toggleParentSideMenu } = props;
	const {
		setSelectedOppTypes,
		selectedOppTypes,
		dataByOppType,
		setApplyFilter
	} = useContext(FilterContext);

	const toggleSideMenu = () => {
		toggleParentSideMenu();
		setOpen(oldState => !oldState);
	};

	const onSelectType = (oppType: IOppType) => {
		setSelectedOppTypes &&
			setSelectedOppTypes(prev => {
				return { ...prev, [oppType]: !prev[oppType] };
			});
	};

	const entries = useMemo(() => {

		if (dataByOppType && Object.keys(dataByOppType).length) {
			return [
				{
					key: IOppType.HIRING,
					count: dataByOppType[IOppType.HIRING]?.length ?? 0,
					text: I18n.t('myOpps.sideMenu.oppTypes.hiring'),
					active: selectedOppTypes && selectedOppTypes[IOppType.HIRING]
				},
				{
					key: IOppType.FUNDRAISING,
					count: dataByOppType[IOppType.FUNDRAISING]?.length ?? 0,
					text: I18n.t('myOpps.sideMenu.oppTypes.fundRaising'),
					active: selectedOppTypes && selectedOppTypes[IOppType.FUNDRAISING]
				},
				{
					key: IOppType.SERVICE_PROVIDER,
					count: dataByOppType[IOppType.SERVICE_PROVIDER]?.length ?? 0,
					text: I18n.t('myOpps.sideMenu.oppTypes.serviceProvider'),
					active:
						selectedOppTypes && selectedOppTypes[IOppType.SERVICE_PROVIDER]
				},
				{
					key: IOppType.BUSINESS_DEVELOPMENT,
					count: dataByOppType[IOppType.BUSINESS_DEVELOPMENT]?.length ?? 0,
					text: I18n.t('myOpps.sideMenu.oppTypes.businessDev'),
					active:
						selectedOppTypes && selectedOppTypes[IOppType.BUSINESS_DEVELOPMENT]
				}
			];
		} else return [];
	}, [{ ...dataByOppType }]);

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
					<S.BackIcon />
				</S.BackButton>

				<S.FilterSection>
					<S.Title text={I18n.t('myOpps.sideMenu.oppTypes.header')} />
					{entries.map((entry, index) => {
						return (
							<React.Fragment key={entry.key}>
								<S.Entry onPress={() => onSelectType(entry.key)}>
									<S.EntryText
										size='s14'
										lineHeight={19}
										text={`${entry.text} (${entry.count})`}
									/>

									{entry.active && <Icons.VIcon height={10} width={10} />}
								</S.Entry>
								<S.Divider display={index !== entries.length - 1} />
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
				text={I18n.t('myOpps.sideMenu.viewContacts')}
				onPress={() => {
					setApplyFilter && setApplyFilter(true);
					toggleSideMenu();
				}}
			/>
			<S.ClearButton onPress={() => {}}>
				<S.ClearTextButton text='Clear' />
			</S.ClearButton>
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

S.BackIcon = styled(Icons.ArrowBackScreen).attrs({
	width: '100%',
	height: '100%'
})``;

S.ClearButton = styled.TouchableOpacity`
	background-color: ${({ theme }) => theme.colors.gray12};
	width: ${deviceWidth * 0.188};
	aspect-ratio: 2.125;
	position: absolute;
	top: ${calcHeight(23)};
	right: ${calcWidth(25)};
	justify-content: center;
	align-items: center;
	border-radius: 18;
`;
S.ClearTextButton = styled(CustomText).attrs({
	size: 's14',
	lineHeight: 21
})``;

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
	align-items: center;
`;

S.EntryText = styled(CustomText)``;

S.Divider = styled.View<{ display: boolean }>`
	display: ${({ display }) => (display ? 'flex' : 'none')};
	height: ${calcHeight(1)};
	margin-horizontal: ${calcWidth(-25)};
	width: ${deviceWidth};
	background-color: ${({ theme }) => theme.colors.gray12};
`;

export default OppTypeMenu;
