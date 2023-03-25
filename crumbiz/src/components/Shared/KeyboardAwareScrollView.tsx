import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
	KeyboardAwareScrollView,
	KeyboardAwareScrollViewProps
} from 'react-native-keyboard-aware-scroll-view';
import { deviceHeight } from '../../utils/dimensions';

interface IProps extends KeyboardAwareScrollViewProps {
	// contentContainerStyle?: StyleProp<ViewStyle>;
	// keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
}

const KeyboardAwareScrollViewComponent: React.FC<IProps> = props => {
	const { children, contentContainerStyle, keyboardShouldPersistTaps } = props;
	const styles = contentContainerStyle || defaultStyles;
	const shouldPersistTaps = keyboardShouldPersistTaps || 'never';
	return (
		<KeyboardAwareScrollView
			keyboardShouldPersistTaps={shouldPersistTaps}
			contentContainerStyle={styles}
			bounces={false}
			enableOnAndroid
		>
			{children}
		</KeyboardAwareScrollView>
	);
};

const defaultStyles: StyleProp<ViewStyle> = {
	flex: 1,
	minHeight: deviceHeight
};

export default KeyboardAwareScrollViewComponent;
