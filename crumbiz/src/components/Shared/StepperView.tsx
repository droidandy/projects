import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import styled from 'styled-components/native';
import Icons from './Icons';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { defaultTheme } from '../../themes';

interface IProps {
	navigation: NavigationScreenProp<any, any>;
	currentStep: number;
	stepSetter: (value: number) => any;
	width?: number;
}

class StepperView extends Component<IProps> {
	private readonly _didFocusSubscription: any;
	private _willBlurSubscription: any;

	constructor(props: IProps) {
		super(props);
		this._didFocusSubscription = props.navigation.addListener('didFocus', () =>
			BackHandler.addEventListener(
				'hardwareBackPress',
				this.onBackButtonPressAndroid
			)
		);
	}

	componentDidMount() {
		this._willBlurSubscription = this.props.navigation.addListener(
			'willBlur',
			() =>
				BackHandler.removeEventListener(
					'hardwareBackPress',
					this.onBackButtonPressAndroid
				)
		);
	}

	onBackButtonPressAndroid = () => {
		const { currentStep, stepSetter, navigation } = this.props;
		if (currentStep !== 0) {
			stepSetter(currentStep - 1);
			return true;

			// Since the back arrow also calls this function, we want to back to the previous screen if current index is 0.
		} else if (currentStep === 0) {
			navigation.goBack();
			return true;
		}
		return false;
	};

	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	}

	render() {
		return (
			<S.Main width={this.props.width}>
				<S.BackIconContainer onPress={this.onBackButtonPressAndroid}>
					<Icons.ArrowBackWithoutLineIcon fill={defaultTheme.colors.black}/>
				</S.BackIconContainer>
				{this.props.children}
			</S.Main>
		);
		return this.props.children;
	}
}

const S: any = {};
S.Main = styled.View`
	flex: 1;
	width: 100%;
	align-self: center;
`;

S.BackIconContainer = styled.TouchableOpacity`
	padding-left: ${deviceWidth * 0.0694};
	padding-top: ${deviceHeight * 0.0359};
	padding-bottom: ${deviceHeight * 0.0343};
`;

export default StepperView;
