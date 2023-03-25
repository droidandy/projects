import React from 'react';
import ProfileItem from './ProfileItem';
import { useTranslation } from 'react-i18next';
import { IStackNavigation } from '../../types/interfaces';
import { ProfileItemCategoriesEnum } from '../../types/enums';
import { ScreensEnum } from '../../navigation/screens';

const ProfileSummary: React.FC<IStackNavigation> = ({ navigation }) => {
	const { t } = useTranslation();

	const allProfileItems = [
		{
			position: 0,
			header: t('myProfile.personalInfo.header'),
			type: ProfileItemCategoriesEnum.PERSONAL_INFO,
			onPress: () => navigation.navigate(ScreensEnum.PERSONAL_INFO)
		},
		{
			position: 1,
			header: t('myProfile.socialNetworks.header'),
			type: ProfileItemCategoriesEnum.SOCIAL_NETWORKS,
			onPress: () => navigation.navigate(ScreensEnum.SOCIAL_NETWORKS)
		},
		{
			position: 2,
			header: t('myProfile.workExperience.header'),
			type: ProfileItemCategoriesEnum.WORK_EXPERIENCE,
			onPress: () => navigation.navigate(ScreensEnum.WORK_EXPERIENCE)
		},
		{
			position: 3,
			header: t('myProfile.aboutMe.header'),
			type: ProfileItemCategoriesEnum.ABOUT_ME,
			onPress: () => navigation.navigate(ScreensEnum.ABOUT_ME)
		}
	];

	return (
		<>
			{allProfileItems.map((item, index) => (
				<ProfileItem
					key={index}
					position={item.position}
					header={item.header}
					type={item.type}
					onPress={item.onPress}
				/>
			))}
		</>
	);
};

export default ProfileSummary;
