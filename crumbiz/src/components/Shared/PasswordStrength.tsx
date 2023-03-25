import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';
import { calcHeight, calcWidth } from '../../utils/dimensions';

interface IProps {
	inputValue: string;
}

const rules = [
	{ regex: /^.{8,}$/, key: Symbol('Min 8 Chars') },
	{ regex: /[0-9]/, key: Symbol('At Least One Number') },
	{ regex: /[!@#$^&*)(+=._-]/, key: Symbol('At least one special char') },
	{ regex: /[A-Z]/, key: Symbol('At least one capital letter') }
];

const calculateScore = (password: string): number => {
	return rules.reduce((acc, { regex }) => {
		if (regex.test(password)) acc++;
		return acc;
	}, 0);
};

const PasswordStrength: React.FC<IProps> = props => {
	const { inputValue } = props;
	const animated = useRef(new Animated.Value(calculateScore(props.inputValue)))
		.current;

	useEffect(() => {
		Animated.timing(animated, {
			toValue: calculateScore(inputValue),
			duration: 500
		}).start();
	}, [inputValue]);

	const colorInterpolation = animated.interpolate({
		inputRange: [0, 1, 2, 3, 4],
		outputRange: [
			'rgba(0, 0, 0, 0)',
			'rgba(193, 0, 0, 1)',
			'rgba(212, 127, 0, 1)',
			'rgba(212, 127, 0, 1)',
			'rgba(0, 133, 13, 1)'
		]
	});

	const widthInterpolation = animated.interpolate({
		inputRange: [0, rules.length],
		outputRange: ['0%', '100%']
	});

	const style = {
		backgroundColor: colorInterpolation,
		width: widthInterpolation
	};

	return (
		<S.BarContainer>
			<Animated.View style={[style, { height: '100%' }]} />
		</S.BarContainer>
	);
};

const S: any = {};
S.BarContainer = styled.View`
	width: ${calcWidth(42)};
	height: ${calcHeight(8)};
	position: absolute;
	right: 52px;
	background: ${({ theme }) => theme.colors.gray5};
	border-radius: 13px;
	overflow: hidden;
`;

export default PasswordStrength;
