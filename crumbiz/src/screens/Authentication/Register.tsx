import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { FormikProps, FormikValues } from 'formik';
import { Form, Typography, Icons, CustomText } from '../../components/Shared';
import {
	RegisterEmailSchema,
	RegisterFullNameSchema,
	RegisterPasswordSchema
} from '../../validations/register.validation';
import { useDispatch } from 'react-redux';
import { IStackNavigation } from '../../types/interfaces';
import {
	deviceWidth,
	deviceHeight,
	moderateScale,
	calcHeight
} from '../../utils/dimensions';
import Link from '../../components/Link/Link';
import { TextInput } from '../../components/Shared/Form@2.0';
import KeyboardAwareScrollView from '../../components/Shared/KeyboardAwareScrollView';
import { afterTwoTicks } from '../../utils';
import { register } from '../../store/actions/authActions';
import { View, StatusBar } from 'react-native';
import { useTheme } from '../../hooks';
import { createLoadingSelector } from '../../store/selectors/pendingSelectors';
import { AuthActionTypes } from '../../store/constants';
import withLoading from '../../hoc/withLoading';

enum RegisterStepsEnum {
	FULL_NAME,
	EMAIL,
	PASSWORD
}

const RegisterSteps = {
	0: {
		translation: 'fullNameStep',
		validationSchema: RegisterFullNameSchema
	},
	1: {
		translation: 'emailStep',
		validationSchema: RegisterEmailSchema
	},
	2: {
		translation: 'passwordStep',
		validationSchema: RegisterPasswordSchema
	}
};

interface IProps extends IStackNavigation {}

const Register: React.FC<IProps> = props => {
	const theme = useTheme();
	const { t } = useTranslation();
	const [currentStepIndex, setCurrentStepIndex] = useState(
		RegisterStepsEnum.FULL_NAME
	);
	const { translation, validationSchema } = RegisterSteps[currentStepIndex];
	let formikPropsRef = useRef<FormikProps<FormikValues>>(null).current;

	const dispatch = useDispatch();

	useEffect(() => {
		afterTwoTicks(() => {
			if (formikPropsRef) {
				formikPropsRef.validateForm();
			}
		});
	}, [currentStepIndex]);

	const renderFormFields = (formikProps: FormikProps<FormikValues>) => {
		switch (currentStepIndex) {
			case RegisterStepsEnum.FULL_NAME:
				return (
					<S.InputContainer>
						<S.Input
							placeholder={t(`register.${translation}.firstName`)}
							value={formikProps.values.firstName}
							onChange={formikProps.handleChange('firstName')}
							textColor='black'
							name='firstName'
							key='firstName'
						/>

						<S.Input
							placeholder={t(`register.${translation}.lastName`)}
							value={formikProps.values.lastName}
							onChange={formikProps.handleChange('lastName')}
							textColor='black'
							name='lastName'
							key='lastName'
						/>
					</S.InputContainer>
				);

			case RegisterStepsEnum.EMAIL:
				return (
					<S.InputContainer>
						<S.Input
							placeholder={t(`register.${translation}.email`)}
							value={formikProps.values.email}
							onChange={formikProps.handleChange('email')}
							displayEmailValidMeter={formikProps.isValid}
							textColor='black'
							name='email'
							key='email'
						/>
					</S.InputContainer>
				);

			case RegisterStepsEnum.PASSWORD:
				const translationKey = `register.${translation}`;
				return (
					<View style={{ width: '100%', height: '100%' }}>
						<S.InputContainer>
							<S.Input
								placeholder={t(`register.${translation}.password`)}
								value={formikProps.values.password}
								onChange={formikProps.handleChange('password')}
								textColor='black'
								name='password'
								type='password'
								displayPasswordStrengthMeter
								key='password'
							/>
						</S.InputContainer>
						<S.TermsTextContainer>
							<S.TermsHeader
								text={t(`${translationKey}.byJoining`)}
								size='s13'
								color='gray15'
							/>
							<Link text={t(`${translationKey}.terms`)} textSize='s13' />
							<Link text={t(`${translationKey}.of`)} textSize='s13' />
							<Link text={t(`${translationKey}.service`)} textSize='s13' />
							<CustomText
								text={t(`${translationKey}.and`)}
								size='s13'
								color='gray15'
							/>
							<Link
								text={t(`${translationKey}.privacyPolicy`)}
								textSize='s13'
							/>
						</S.TermsTextContainer>
					</View>
				);
		}
	};

	return (
		<KeyboardAwareScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			keyboardShouldPersistTaps='always'
		>
			<StatusBar backgroundColor={theme.colors.white} barStyle='dark-content' />
			<S.Wrapper stepIndex={currentStepIndex}>
				<Form
					withStepper
					stepsLength={2}
					stepSetter={setCurrentStepIndex}
					currentStep={currentStepIndex}
					headerText={t(`register.${translation}.stepHeader`)}
					fieldsDescription={t(`register.${translation}.fieldsDescription`)}
					actionButtonText={t(`register.${translation}.actionButtonText`)}
					initialValues={{
						firstName: '',
						lastName: '',
						email: '',
						password: ''
					}}
					validateOnMount
					onSubmit={values => {
						dispatch(register(values));
					}}
					validationSchema={validationSchema}
				>
					{(formikProps: FormikProps<FormikValues>) => {
						formikPropsRef = formikProps;
						return (
							<S.FieldsContainer>
								{renderFormFields(formikProps)}
							</S.FieldsContainer>
						);
					}}
				</Form>
			</S.Wrapper>
		</KeyboardAwareScrollView>
	);
};

const S: any = {};

S.Wrapper = styled.View<{ stepIndex: RegisterStepsEnum }>`
	align-items: flex-start;
	align-self: center;
	flex: 1;
	height: ${deviceHeight * 0.9};
`;

S.FieldsContainer = styled.View`
	justify-content: space-between;
`;

S.InputContainer = styled.View`
	margin-top: ${deviceHeight * 0.078};
`;

S.IconContainer = styled.View`
	display: flex;
	align-self: flex-end;
	padding-right: ${deviceWidth * 0.0694};
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

S.TermsTextContainer = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	margin-bottom: ${deviceHeight * 0.046875};
	margin-top: auto;
`;

S.TermsHeader = styled(CustomText)`
	margin-bottom: -5;
`;

const selector = createLoadingSelector(AuthActionTypes.REGISTER);

export default withLoading({ selector })(Register);
