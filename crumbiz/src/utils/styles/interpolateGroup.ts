import { AnimatedValue } from 'react-navigation';
import { DynamicObject } from '../../types/interfaces';

type NumberRange = number[];
type StringRange = string[];
type Group = DynamicObject<StringRange | NumberRange>;

export interface IInterpolateGroupParams {
	animatedValue: AnimatedValue;
	inputRange: NumberRange;
	groups: Group;
}

const interpolateGroup = ({
	animatedValue,
	groups,
	inputRange
}: IInterpolateGroupParams) => {
	return Object.keys(groups).reduce((acc, currentGroup) => {
		acc[currentGroup] = animatedValue.interpolate({
			inputRange,
			outputRange: groups[currentGroup]
		});
		return acc;
	}, {} as DynamicObject<AnimatedValue>);
};

export default interpolateGroup;
