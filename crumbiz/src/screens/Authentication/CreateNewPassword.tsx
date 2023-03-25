import React, { useState, useCallback } from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { FormikProps, FormikValues } from 'formik';
import {
	Form,
	Icons,
	Typography,
	CustomText,
	KeyboardAwareScrollView
} from '../../components/Shared';
import { IStackNavigation } from '../../types/interfaces';
import { navigationService } from '../../services';
import { useCaptureBackButton } from '../../hooks';
import { calcWidth, deviceHeight } from '../../utils/dimensions';
import { CreatePasswordSchema } from '../../validations/createNewPassword.validation';
import { useDispatch } from 'react-redux';
import { changePassword, resetPassword } from '../../store/actions/authActions';
import TextInput from '../../components/Shared/Form@2.0/TextInput';
import { createLoadingSelector } from '../../store/selectors/pendingSelectors';
import { AuthActionTypes } from '../../store/constants';
import withLoading from '../../hoc/withLoading';
import { ScreensEnum } from '../../navigation/screens';
import { StackEnums } from '../../navigation/stacks';

interface IProps extends IStackNavigation {}

enum CreateNewPasswordSteps {
	ENTER_PASSWORD,
	PASSWORD_CHANGED
}

const CreatePasswordSteps = {
	0: {
		translation: 'createStep'
	},
	1: {
		translation: 'doneStep'
	}
};

const RestorePassword: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const [currentStepIndex, setCurrentStepIndex] = useState(
		CreateNewPasswordSteps.ENTER_PASSWORD
	);
	const translationKey = CreatePasswordSteps[currentStepIndex].translation;
	const dispatch = useDispatch();

	const code = props.navigation.getParam('code');
	const email = props.navigation.getParam('email');

	const submitHandler = useCallback(
		(formValues: { password: string; confirmPassword: string }) => {
			//This means we are changing password throug deeplink (restore password)
			if (code && email) {
				dispatch(resetPassword({ password: formValues.password, code, email }));
			} else {
				dispatch(changePassword(formValues.password));
			}
		},
		[]
	);

	return (
		<KeyboardAwareScrollView
			contentContainerStyle={{ flex: 1, minHeight: deviceHeight * 0.6 }}
		>
			<S.Wrapper>
				{/*
				//@ts-ignore */}
				<Form
					withStepper
					stepSetter={setCurrentStepIndex}
					currentStep={currentStepIndex}
					headerText={t(`createNewPassword.createStep.headerText`)}
					actionButtonText={t(
						`createNewPassword.${translationKey}.actionButtonText`
					)}
					fieldsDescription={t(
						`createNewPassword.createStep.fieldsDescription`
					)}
					initialValues={{
						password: '',
						confirmPassword: ''
					}}
					validateOnMount
					onSubmit={formValues => {
						submitHandler(formValues);
					}}
					hideHeading={
						currentStepIndex === CreateNewPasswordSteps.PASSWORD_CHANGED
					}
					// TODO Sason - Check why this throws interface error (typescript)
					// @ts-ignore
					onActionButtonPress={
						currentStepIndex === CreateNewPasswordSteps.PASSWORD_CHANGED
							? () => props.navigation.navigate(ScreensEnum.LOGIN)
							: null
					}
					validationSchema={
						CreateNewPasswordSteps.ENTER_PASSWORD === currentStepIndex
							? CreatePasswordSchema
							: null
					}
				>
					{(formikProps: FormikProps<FormikValues>) => {
						if (currentStepIndex === CreateNewPasswordSteps.ENTER_PASSWORD) {
							return (
								<S.FieldsContainer>
									<S.Input
										placeholder={t('createNewPassword.password')}
										onChange={formikProps.handleChange('password')}
										textColor='black'
										password
										displayPasswordStrengthMeter
										value={formikProps.values.password}
										type='password'
									/>
									<S.Input
										placeholder={t('createNewPassword.confirmPassword')}
										onChange={formikProps.handleChange('confirmPassword')}
										textColor='black'
										password
										displayPasswordStrengthMeter
										value={formikProps.values.confirmPassword}
										type='password'
									/>
								</S.FieldsContainer>
							);
						} else if (
							currentStepIndex === CreateNewPasswordSteps.PASSWORD_CHANGED
						) {
							return (
								<S.PasswordChanged>
									<Icons.PasswordChangedIcon />
									<CustomText
										text={t('createNewPassword.doneStep.headerText')}
										size='s22'
									/>
									<CustomText
										text={t('createNewPassword.doneStep.fieldsDescription')}
										size='s14'
										color='gray15'
									/>
								</S.PasswordChanged>
							);
						}
					}}
				</Form>
			</S.Wrapper>
		</KeyboardAwareScrollView>
	);
};

const S: any = {};

S.Wrapper = styled.View`
	align-items: center;
	flex: 1;
	align-self: center;
`;

S.FieldsContainer = styled.View`
	height: 121px;
	justify-content: space-between;
	margin-top: ${deviceHeight * 0.1};
`;

S.PasswordChanged = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	width: 100%;
`;

S.Input = styled(TextInput)`
	align-self: flex-start;
	flex-shrink: 0;
	background-color: ${({ theme }) => theme.colors.white};
	border-top-width: 0;
	border-left-width: 0;
	border-right-width: 0;
	border-bottom-color: ${({ theme }) => theme.colors.gray16};
	padding-left: 0;
	margin-bottom: ${deviceHeight * 0.078125};
`;

const selectors = [
	createLoadingSelector(AuthActionTypes.RESET_PASSWORD),
	createLoadingSelector(AuthActionTypes.CHANGE_PASSWORD)
];

const selector = (state: any) => selectors.some(s => s(state));

export default withLoading({ selector })(RestorePassword);
