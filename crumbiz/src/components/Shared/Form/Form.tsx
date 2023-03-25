import React, { useCallback } from 'react';
import styled from 'styled-components/native';
import Button from '../Button';
import StepperView from '../StepperView';
import CustomText from '../CustomText';
import { useNavigation } from 'react-navigation-hooks';
import { Formik, FormikConfig, FormikProps, FormikValues } from 'formik';
import { IStyle } from '../../../types/interfaces';
import { deviceWidth } from '../../../utils/dimensions';

interface IProps extends FormikConfig<any>, IStyle {
	headerText?: string;
	fieldsDescription?: string;
	actionButtonText?: string;
	withStepper?: boolean;
	currentStep?: number;
	stepsLength?: number;
	stepSetter?: (value: number) => any;
	children: React.ReactNode;
	hideHeading?: boolean;
	hideActionButton?: boolean;
	onActionButtonPress?: () => any | null;
}

const Form: React.FC<IProps> = ({
	currentStep,
	stepSetter,
	headerText,
	actionButtonText,
	fieldsDescription,
	withStepper,
	children,
	hideActionButton,
	hideHeading,
	onActionButtonPress,
	stepsLength,
	style,
	...rest
}) => {
	const navigation = useNavigation();
	const renderContent = useCallback(() => {
		return (
			<>
				{hideHeading ? null : (
					<S.HeadingContainer>
						<CustomText text={headerText} size='s22' bold/>
						<CustomText text={fieldsDescription} size='s14' color='gray15'/>
					</S.HeadingContainer>
				)}

				<Formik {...rest}>
					{(formikProps: FormikProps<FormikValues>) => (
						<>
							<S.ChildrenContainer>
								{/*
							//@ts-ignore */}
								{children(formikProps)}
							</S.ChildrenContainer>

							{hideActionButton ? null : (
								<Button
									width={deviceWidth}
									borderRadius='0px'
									text={actionButtonText!}
									disabled={!formikProps.isValid}
									gradientBackground={formikProps.isValid ? 'orange' : 'gray2'}
									onPress={
										onActionButtonPress
											? onActionButtonPress
											: () =>
													currentStep! < stepsLength!
														? stepSetter!(currentStep! + 1)
														: formikProps.submitForm()
									}
								/>
							)}
						</>
					)}
				</Formik>
			</>
		);
	}, [currentStep]);

	return withStepper ? (
		<StepperView
			navigation={navigation}
			currentStep={currentStep!}
			stepSetter={stepSetter!}
		>
			{renderContent()}
		</StepperView>
	) : (
		<S.Main style={style}>{renderContent()}</S.Main>
	);
};

const S: any = {};
S.HeadingContainer = styled.View`
	padding-horizontal: ${deviceWidth * 0.0694};
`;

S.Main = styled.View`
	flex: 1;
	align-self: center;
	width: 100%;
`;

S.ChildrenContainer = styled.KeyboardAvoidingView`
	flex: 1;
	padding-horizontal: ${deviceWidth * 0.0694};
`;

export default Form;
