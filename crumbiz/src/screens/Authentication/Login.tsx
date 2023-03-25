import React, { useEffect } from 'react';
import { IStackNavigation } from '../../types/interfaces';
import { Formik, FormikProps, FormikValues } from 'formik';
import { useTranslation } from 'react-i18next';
import Link from '../../components/Link/Link';
import theme from '../../themes/defaultTheme';
import * as S from './styles';
import { Button, Icons } from '../../components/Shared';
import { useDispatch } from 'react-redux';
import { confirmRegistration, login } from '../../store/actions/authActions';
import KeyboardAwareScrollView from '../../components/Shared/KeyboardAwareScrollView';
import { StatusBar } from 'react-native';
import { OppsScreenHeader } from '../../components/Opps';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import withLoading from '../../hoc/withLoading';
import {
	createLoadingSelector,
	loadingsSelector
} from '../../store/selectors/pendingSelectors';
import { AuthActionTypes } from '../../store/constants';
import { ScreensEnum } from '../../navigation/screens';

interface IProps extends IStackNavigation {}

const linkedinIconProps = {
	fill: theme.colors.white,
	width: deviceWidth * 0.04,
	height: deviceWidth * 0.04
};

const Login: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const email = props.navigation.getParam('email');
	const code = props.navigation.getParam('code');

	useEffect(() => {
		if (email && code) {
			dispatch(confirmRegistration(email, code));
		}
	}, []);

	return (
		<KeyboardAwareScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			keyboardShouldPersistTaps='always'
		>
			<StatusBar backgroundColor={theme.colors.white} barStyle='dark-content' />
			<S.Wrapper>
				<S.WidthLimiter>
					<OppsScreenHeader
						pre={t('login.intro')}
						header={t('login.welcome')}
						alignment='flex-start'
						marginTop={0}
						marginBottom={deviceHeight * 0.048}
					/>
					<Button
						backgroundColor={theme.colors.linkedInButtonColor}
						text={t('login.continueWithLinkedIn')}
						onPress={() => {}}
						icon={Icons.LinkedIcon}
						borderRadius='100px'
						iconProps={linkedinIconProps}
						textSize={13}
						textWeight='500'
					/>

					<S.OrLineContainer>
						<S.OrLine />
						<S.OrText>{t('login.or')}</S.OrText>
						<S.OrLine />
					</S.OrLineContainer>

					<Formik
						initialValues={{
							email: email || '',
							password: ''
						}}
						onSubmit={formValues => {
							dispatch(login(formValues));
						}}
						validateOnMount
						enableReinitialize
					>
						{(formikProps: FormikProps<FormikValues>) => {
							return (
								<>
									<S.LoginFieldsWrapper>
										<S.Input
											placeholder={t('login.email')}
											name='email'
											onChange={formikProps.handleChange('email')}
											value={formikProps.values.email}
											textColor='black'
										/>

										<S.Input
											placeholder={t('login.password')}
											name='password'
											type='password'
											onChange={formikProps.handleChange('password')}
											value={formikProps.values.password}
											textColor='black'
										/>
										<S.ForgotPasswordLinkContainer>
											<Link
												textSize='s13'
												text={t('login.forgotYourPassword')}
												onPress={() =>
													props.navigation!.navigate(
														ScreensEnum.RESTORE_PASSWORD
													)
												}
											/>
										</S.ForgotPasswordLinkContainer>
									</S.LoginFieldsWrapper>
									<S.LoginButtonWrapper>
										<Button
											text={t('login.login')}
											borderRadius='100px'
											gradientBackground='orange'
											textColor={theme.colors.white}
											onPress={formikProps.submitForm}
											upperCase
										/>
									</S.LoginButtonWrapper>

									<S.SignUpContainer>
										<S.SignUpText>
											{t('login.dontHaveCrumbizAccount')}
										</S.SignUpText>
										<Link
											textSize='s13'
											text={t('login.createLink')}
											onPress={() =>
												props.navigation!.navigate(ScreensEnum.REGISTER)
											}
										/>
									</S.SignUpContainer>
								</>
							);
						}}
					</Formik>
				</S.WidthLimiter>
			</S.Wrapper>
		</KeyboardAwareScrollView>
	);
};

const selector = createLoadingSelector(AuthActionTypes.LOGIN);

export default withLoading({ selector })(Login);
