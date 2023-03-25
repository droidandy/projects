import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import HeaderMenu from '../HeaderMenu';
import Icons from '../Icons';
import SubmitButton from '../SubmitButton';
import TabView from '../TabView';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { PlainFunction, IEntity } from '../../../types/interfaces';
import ContactsTab from './ContactsTab';
import { StatusBar, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '../../../hooks';
import CrumbizTab from './CrumbizTab';
import { TextInput } from '../Form@2.0';
import { deviceHeight, deviceWidth } from '../../../utils/dimensions';
import { defaultTheme } from '../../../themes';
import Contacts from '../../../services/Contacts';
import useAsyncEffect from '../../../hooks/useAsyncEffect';
import convertContactToSectionItem from './utils/convertContactToSectionItem';

import CustomText from '../CustomText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export interface ISectionItem {
	onPress?: () => void;
	text: string;
	id: string;
	key: string;
}

export interface ISection<T> {
	title: string | null;
	data: Array<T>;
}

interface IProps {
	onItemPress(newContact: IEntity): any;
	closeOnPress: PlainFunction;
	preHeaderText?: string;
	headerText?: string;
	preInitiatorText?: string;
	headerInitiatorText?: string;
}

const ChooseConnectionTabs: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const [currentTabIndex, setCurrentTabIndex] = useState(0);
	const {
		onItemPress,
		preHeaderText,
		headerText,
		preInitiatorText,
		headerInitiatorText,
		closeOnPress
	} = props;
	const theme = useTheme();
	const [searchTerm, setSearchTerm] = useState('');
	const [sectionsToRender, setSectionsToRender] = useState<
		Array<ISection<ISectionItem>>
	>([]);

	const [submitIsVisible, setSubmitVisibility] = useState<boolean>(false);

	const isEmail = (term: string) => {
		return !!term.match(/^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i);
	};

	useEffect(() => {
		isEmail(searchTerm)
			? setSubmitVisibility(true)
			: setSubmitVisibility(false);
	}, [searchTerm]);

	useAsyncEffect(async () => {
		try {
			const contacts = await Contacts.getAll();
			//@ts-ignore
			setSectionsToRender([
				// New Contact button

				{
					title: null,
					data: [
						{
							text: t('opps.selectConnector.newContact'),
							id: '__new__',
							onPress: async () => {
								const newContact = await Contacts.openContactForm();
								if (newContact) {
									const convertedContact = convertContactToSectionItem(
										newContact
									);
									onItemPress(convertedContact);
								}
							}
						}
					]
				},
				contacts
					.filter(contact =>
						Boolean(
							(contact.emailAddresses.length || contact.phoneNumbers.length) &&
								(contact.givenName || contact.familyName)
						)
					)
					.sort((contactA, contactB) =>
						contactA.givenName.localeCompare(contactB.givenName)
					)
					.reduce(
						(acc, currentContact) => {
							acc.data.push(convertContactToSectionItem(currentContact));
							return acc;
						},
						{
							title: 'Contacts',

							data: [] as Array<IEntity>
						}
					)
			]);
		} catch (error) {}
	}, []);

	const _tabs = useMemo(() => {
		return [
			{
				key: 'fromContacts',
				title: t('opps.selectConnector.categories.fromContact'),
				component: () => (
					<ContactsTab
						onItemPress={onItemPress as any}
						sections={sectionsToRender}
						searchTerm={searchTerm}
						sectionHeaderBackgroundColor={defaultTheme.colors.gray14}
						sectionHeaderTextColor={defaultTheme.colors.black}
						sectionHeaderTextSize={defaultTheme.fontSizes.s12}
					/>
				)
			},
			{
				key: 'fromCrumbiz',
				title: t('opps.selectConnector.categories.fromCrumbiz'),
				component: () => (
					<CrumbizTab
						onItemPress={onItemPress as any}
						searchTerm={searchTerm}
					/>
				)
			}
			// {
			// 	key: 'fromLinkedin',
			// 	title: t('opps.selectConnector.categories.fromLinkedin'),
			// 	component: () => <LinkedInTab />
			// }
		];
	}, [searchTerm, sectionsToRender]);

	return (
		<S.Container>
			<KeyboardAwareScrollView
				enableOnAndroid
				contentContainerStyle={{ flexGrow: 1 }}
				keyboardShouldPersistTaps='always'
				bounces={false}
				enableResetScrollToCoords={false}
			>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1, minHeight: deviceHeight }}
					keyboardDismissMode='none'
					bounces={false}
					keyboardShouldPersistTaps='always'
				>
					<StatusBar
						backgroundColor={theme.colors.white}
						barStyle='dark-content'
					/>
					<HeaderMenu
						leftIcon={{ iconColor: 'black' }}
						rightIcon={{
							iconColor: 'black',
							onPress: () =>
								typeof closeOnPress == 'function' && closeOnPress(),
							icon: Icons.XIcon
						}}
					/>
					<S.TopPortion>
						<CustomText
							text={preHeaderText ? preHeaderText : preInitiatorText}
							color={preHeaderText ? 'gray1' : 'black'}
							size={preHeaderText ? 's16' : 's22'}
							bold={preHeaderText ? true : false}
						/>
						<CustomText
							text={headerText ? headerText : headerInitiatorText}
							size={headerText ? 's22' : 's16'}
							bold={headerText ? false : true}
							color='black'
							withBottomGap
						/>
						<S.Input
							placeholder={t('opps.selectConnector.inputPlaceholder')}
							onChange={setSearchTerm}
							value={searchTerm}
							textColor={defaultTheme.colors.black}
						/>
					</S.TopPortion>

					<S.BottomPortion>
						<TabView
							tabs={_tabs}
							index={currentTabIndex}
							setIndex={setCurrentTabIndex}
							tabBarBackgroundColor={theme.colors.gray12}
						/>
						{submitIsVisible && (
							<SubmitButton
								onPress={() => {
									// open FullName modal
								}}
								gradientBackground='orange'
								width='100%'
								text='next'
							/>
						)}
					</S.BottomPortion>
				</ScrollView>
			</KeyboardAwareScrollView>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.SafeAreaView`
	flex: 1;
`;

S.TopPortion = styled.View`
	width: 100%;
	background-color: ${({ theme }) => theme.colors.white};
	padding-horizontal: ${deviceWidth * 0.0694};
	margin-top: ${deviceHeight * 0.0156};
	margin-bottom: ${deviceHeight * 0.0625};
`;

S.BottomPortion = styled.View`
	flex: 1;
`;

S.Input = styled(TextInput)`
	width: 100%;
	align-self: flex-start;
	flex-shrink: 0;
	background-color: ${defaultTheme.colors.white};
	border-top-width: 0;
	border-left-width: 0;
	border-right-width: 0;
	border-bottom-color: ${defaultTheme.colors.gray16};
	padding-left: 0;
`;

export default gestureHandlerRootHOC(ChooseConnectionTabs);
