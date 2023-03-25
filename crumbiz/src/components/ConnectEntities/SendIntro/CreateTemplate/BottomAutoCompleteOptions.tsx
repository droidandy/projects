import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { IOpportunityConnectors } from '../../../../types/interfaces';
import OpSummary from '../../../Shared/OpSummary/OpSummary';
import { OpportunityCategoriesEnum } from '../../../../types/enums';

interface IProps {
	visible: boolean;
	onCategorySelection(text: string): any;
	data: IOpportunityConnectors;
}

const BottomAutoCompleteOptions: React.FC<IProps> = props => {
	const { visible, onCategorySelection, data } = props;
	const animated = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(animated, {
			toValue: visible ? 1 : 0,
			duration: 100,
			useNativeDriver: true
		}).start();
	}, [visible]);

	return (
		<S.Container
			pointerEvents={visible ? 'auto' : 'none'}
			style={{ opacity: animated }}
		>
			<OpSummary
				data={data}
				touchable
				onPress={text => onCategorySelection(text)}
				trimmed
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled(Animated.View)`
	flex: 1;
	width: 100%;
	height: 65%;
	padding-horizontal: 25;
	margin-bottom: 25;
`;

export default BottomAutoCompleteOptions;
