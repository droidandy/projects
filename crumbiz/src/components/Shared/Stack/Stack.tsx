import React, { useState } from 'react';
import { StateUpdaterFunction } from '../../../types/interfaces';
import { View } from 'react-native';

interface IRenderProps {
	currentIndex: number | null;
	setCurrentIndex: StateUpdaterFunction<number | null>;
}

interface IProps {
	children: (values: IRenderProps) => React.ReactNode;
}
const Stack: React.FC<IProps> = props => {
	const [currentIndex, setCurrentIndex] = useState<number | null>(null);
	const { children } = props;

	return <View>{children({ currentIndex, setCurrentIndex })}</View>;
};

export default Stack;
