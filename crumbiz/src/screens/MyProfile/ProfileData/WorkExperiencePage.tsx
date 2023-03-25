import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from '../../../hooks';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import WorkExperienceList from './WorkExperienceList';
import { IStackNavigation } from '../../../types/interfaces';
import { TextInput } from '../../../components/Shared/Form@2.0';
import { deviceWidth, deviceHeight } from '../../../utils/dimensions';
import { CustomText, Button, HeaderMenu } from '../../../components/Shared';

interface IWorkExperience {
	companyName: string;
	position: string;
}

const WorkExperience: React.FC<IStackNavigation> = ({ navigation }) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const [position, setPosition] = useState('');
	const [companyName, setCompanyName] = useState('');
	const [firstExperience, setFirstExperience] = useState<IWorkExperience>();

	const showAllExperience = firstExperience;
	const showAddButton = position && companyName !== '';

	return (
		<S.Container>
			<StatusBar backgroundColor={theme.colors.white} barStyle='dark-content' />
			<HeaderMenu leftIcon={{ iconColor: 'black' }} />
			<S.TopPortion>
				<CustomText
					bold
					size='s20'
					withBottomGap
					text={t('myProfile.workExperience.header')}
				/>
				{showAllExperience ? (
					//@ts-ignore
					<WorkExperienceList firstExperience={firstExperience} />
				) : (
					<>
						<S.Input
							editable={false}
							textSize={15}
							maxLength={40}
							value={companyName}
							textColor={theme.colors.black}
							marginBottom={deviceHeight * 0.06}
							onChange={(text: string) => setCompanyName(text)}
							placeholder={t('myProfile.workExperience.companyName')}
						/>
						<S.Input
							editable={false}
							value={position}
							textSize={15}
							maxLength={40}
							textColor={theme.colors.black}
							marginBottom={deviceHeight * 0.03125}
							onChange={(text: string) => setPosition(text)}
							placeholder={t('myProfile.workExperience.position')}
						/>
						{showAddButton ? (
							<Button
								text={t('myProfile.workExperience.addButton')}
								textSize={14}
								borderRadius='25px'
								alignSelf='flex-end'
								width={deviceWidth * 0.18}
								height={deviceHeight * 0.04}
								textColor={theme.colors.black}
								backgroundColor={theme.colors.gray19}
								onPress={() => {
									setFirstExperience({
										companyName: companyName,
										position: position
									});
								}}
							/>
						) : null}
					</>
				)}
			</S.TopPortion>
			<Button
				width={deviceWidth}
				backgroundColor='orange'
				text={t('myProfile.mainPage.actionButton')}
				onPress={() => {
					// TODO Yaron - integration
					navigation.goBack();
				}}
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.white};
`;

S.TopPortion = styled.View`
	padding-horizontal: ${deviceWidth * 0.0694};
	background-color: ${({ theme }) => theme.colors.white};
`;

S.Input = styled(TextInput)`
	border-top-width: 0;
	border-left-width: 0;
	border-right-width: 0;
	font-size: ${({ theme }) => theme.fontSizes.s15};
	border-bottom-color: ${({ theme }) => theme.colors.gray16};
`;

export default WorkExperience;
