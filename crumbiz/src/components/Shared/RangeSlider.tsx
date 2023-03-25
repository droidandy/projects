import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { View, LayoutChangeEvent } from 'react-native';
import Slider from '@react-native-community/slider';
import { PlainFunction } from '../../types/interfaces';
import { convertBudgetNumberToString, afterTwoTicks } from '../../utils';
import { deviceHeight } from '../../utils/dimensions';
import CustomText from './CustomText';

export type RangeSliderChangeCallbackParams = {
	value: number | string;
	isInitialRender?: boolean;
};
export interface IRangeSliderRefActions {
	setResetToInitialValue: PlainFunction;
}
interface IProps {
	minValue: number;
	maxValue: number;
	onValueChange: (params: RangeSliderChangeCallbackParams) => any;
}

const RangeSlider = React.forwardRef<any, IProps>((props, ref) => {
	const { minValue, maxValue, onValueChange } = props;
	const initialValue = (minValue + maxValue) / 2;
	const [currentValue, setValue] = useState(initialValue);
	const [showRange, setShowRange] = useState(true);
	const [rangeSliderHeight, setRangeSliderHeight] = useState(0);

	useEffect(() => {
		// @ts-ignore
		ref.current = {
			setResetToInitialValue: () => {
				setValue(initialValue);
				setShowRange(false);
				afterTwoTicks(() => {
					setShowRange(true);
				});
			}
		};
	}, []);

	const fixedValue = convertBudgetNumberToString(currentValue, 1);

	return (
		<S.SliderContentContainer>
			<S.CurrentValue text={fixedValue} size='s44' bold center />
			<S.MinMaxValuesContainer>
				<CustomText
					size='s12'
					color='paleBlue1'
					text={convertBudgetNumberToString(minValue, 0)}
				/>
				<CustomText
					size='s12'
					color='paleBlue1'
					text={convertBudgetNumberToString(maxValue, 0)}
				/>
			</S.MinMaxValuesContainer>
			<View style={{ height: rangeSliderHeight ? rangeSliderHeight! : 'auto' }}>
				<S.Line />
				{showRange && (
					<Slider
						style={{
							zIndex: 2,
							width: '100%'
						}}
						onLayout={(e: LayoutChangeEvent) => {
							setRangeSliderHeight(e.nativeEvent.layout.height);
						}}
						minimumValue={minValue}
						maximumValue={maxValue}
						value={initialValue}
						onValueChange={value => {
							setValue(value);
							typeof onValueChange == 'function' &&
								onValueChange({
									value: value.toFixed(0)
								});
						}}
						thumbImage={require('../../assets/images/dollarSignCircle.png')}
						maximumTrackTintColor='transparent'
						minimumTrackTintColor='transparent'
					/>
				)}
			</View>
		</S.SliderContentContainer>
	);
});

const S: any = {};
S.SliderContentContainer = styled.View`
	margin-top: auto;
`;

S.CurrentValue = styled(CustomText)`
	margin-vertical: ${deviceHeight * 0.1484};
`;

S.MinMaxValuesContainer = styled.View`
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	padding-horizontal: 5px;
`;

S.Line = styled.View`
	width: 100%;
	align-self: center;
	border-radius: 30px;
	background-color: ${props => props.theme.colors.gray14};
	height: ${deviceHeight * 0.00625};
	position: absolute;
	top: 8px;
`;

export default RangeSlider;
