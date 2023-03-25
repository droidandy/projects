import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../components/Shared/Modal';
import { useTheme } from '../../hooks';
import { ModalHeaderText, ModalText } from '../../components/Shared/ModalAndDropdownContents';
import { IModalAndSlidingDropdownControls } from '../../types/interfaces';
import { IStackNavigation } from '../../types/interfaces';
import { Button } from '../../components/Shared';
import { deviceHeight } from '../../utils/dimensions';
import styled from 'styled-components/native';
import { ScreensEnum } from '../../navigation/screens';

const TryAgainOrSignUp:React.FC<IStackNavigation> = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const tryAgainOrSignUpRef = useRef<IModalAndSlidingDropdownControls>(null);

  useEffect(() => {tryAgainOrSignUpRef.current!.open()}, []);

	return (
		<Modal ref={tryAgainOrSignUpRef} onClose={navigation.goBack}>
			<ModalHeaderText text={t('oppOverview.modals.tryAgainOrSignUp.headerText')} />

			<ModalText text={t('oppOverview.modals.tryAgainOrSignUp.text')} />

			<S.ButtonContainer>
				<Button
					rounded
					gradientBackground='orange'
					text={t('oppOverview.modals.tryAgainOrSignUp.pressSignUp')}
					onPress={() => {
							tryAgainOrSignUpRef.current!.close();
							navigation.navigate(ScreensEnum.REGISTER);
					}}
				/>
				<Button
					rounded
					text={t('oppOverview.modals.tryAgainOrSignUp.pressTryAgain')}
					onPress={() => tryAgainOrSignUpRef.current!.close()}
					textColor={theme.colors.gray15}
					backgroundColor='transparent'
				/>
			</S.ButtonContainer>
		</Modal>
	)
};

const S: any = {};
S.ButtonContainer = styled.View`
	margin-top: ${deviceHeight * 0.046875}
	flex-direction: column;
`;

export default TryAgainOrSignUp;
