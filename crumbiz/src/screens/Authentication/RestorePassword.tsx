import React from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { FormikProps, FormikValues } from 'formik';
import { Form, Icons, Typography, CustomText } from '../../components/Shared';
import { IStackNavigation } from '../../types/interfaces';
import { deviceWidth, deviceHeight } from '../../utils/dimensions';
import { RestorePasswordSchema } from '../../validations/restore-password';
import { forgotPassword } from '../../store/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { RestorePasswordSteps } from '../../store/reducers/authReducer';
import { restoreStepperSelector } from '../../store/selectors/authSelector';
import { TextInput } from '../../components/Shared/Form@2.0';
import { navigationService } from '../../services';
import { createLoadingSelector } from '../../store/selectors/pendingSelectors';
import { AuthActionTypes } from '../../store/constants';
import withLoading from '../../hoc/withLoading';
import { ScreensEnum } from '../../navigation/screens';
import { StackEnums } from '../../navigation/stacks';

interface IProps extends IStackNavigation {}

const RestorePassword: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const restorePassStepper = useSelector(restoreStepperSelector);
	const dispatch = useDispatch();

	return (
		<S.Wrapper>
			<Form
				stepSetter={() => {
					props.navigation.navigate(ScreensEnum.LOGIN);
				}}
				withStepper
				currentStep={restorePassStepper}
				headerText={t('restorePassword.headerText')}
				actionButtonText={t('restorePassword.actionButtonText')}
				fieldsDescription={t('restorePassword.fieldsDescription')}
				initialValues={{
					email: ''
				}}
				validateOnMount
				onSubmit={formValues => {
					dispatch(forgotPassword(formValues.email));
				}}
				hideHeading={restorePassStepper === RestorePasswordSteps.EMAIL_SENT}
				hideActionButton={
					restorePassStepper === RestorePasswordSteps.EMAIL_SENT
				}
				validationSchema={RestorePasswordSchema}
			>
				{(formikProps: FormikProps<FormikValues>) => {
					if (restorePassStepper === RestorePasswordSteps.ENTER_EMAIL) {
						return (
							<S.FieldsContainer>
								<S.Input
									name='email'
									placeholder={t('restorePassword.typeYourEmail')}
									onChange={formikProps.handleChange('email')}
									value={formikProps.values.email}
									textColor='black'
								/>
							</S.FieldsContainer>
						);
					} else if (restorePassStepper === RestorePasswordSteps.EMAIL_SENT) {
						return (
							<S.WeSentYouAnEmail>
								<Icons.CheckYourInboxIcon
									width={deviceWidth * 0.6}
									height={deviceHeight * 0.55}
								/>
								<S.Header
									text={t('restorePassword.checkYourInbox')}
									size='s22'
								/>
								<S.Text
									center
									text={t('restorePassword.weSentYouALinkToReset')}
									size='s14'
									color='gray15'
								/>
							</S.WeSentYouAnEmail>
						);
					}
				}}
			</Form>
		</S.Wrapper>
	);
};

const S: any = {};

S.Wrapper = styled.View`
	flex: 1;
	align-items: center;
	align-self: center;
`;

S.FieldsContainer = styled.View`
	justify-content: space-between;
	margin-top: ${deviceHeight * 0.0578};
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
	margin-bottom: ${deviceHeight * 0.4140625};
`;

S.WeSentYouAnEmail = styled.View`
	flex: 1;
	align-items: center;
	align-self: center;
	width: 100%;
`;

S.Header = styled(CustomText)`
	margin-left: ${deviceWidth * 0.0694};
	margin-right: ${deviceWidth * 0.0694};
`;

S.Text = styled(CustomText)`
	margin-left: ${deviceWidth * 0.0694};
	margin-right: ${deviceWidth * 0.0694};
`;

const selector = createLoadingSelector(AuthActionTypes.FORGOT_PASSWORD);

export default withLoading({ selector })(RestorePassword);
