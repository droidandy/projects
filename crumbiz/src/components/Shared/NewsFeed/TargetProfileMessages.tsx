import React, {
	FC,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { NativeComponent, ScrollView, Keyboard } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Textarea from '../Textarea';
import SubmitButton from '../SubmitButton';
import {
	oppOverviewSelector,
	IOppOverViewSelector
} from '../../../store/selectors/oppOverviewSelector';
import { ccToConnectorToggle } from '../../../store/actions/oppOverviewActions';

import {
	calcFontSize,
	deviceHeight,
	deviceWidth,
	calcWidth
} from '../../../utils/dimensions';
import { CustomText } from '../index';
import SwitchOnAndOff from '../SwitchOnAndOff';
import { PlainFunction, StateUpdaterFunction } from '../../../types/interfaces';
import { activeButtonType } from './TargetProfileQuestions';
import { EntityEnum } from '../../../types/enums';

interface IProps {
	sendInteractionHandler: PlainFunction;
	setActiveButton: StateUpdaterFunction<activeButtonType>;
	toggleExpandSubcontents: StateUpdaterFunction<boolean>;
	entityName: string;
}

const translationPrefix = 'oppOverview.targetProfile';

const TargetProfileMessages: FC<IProps> = ({
	sendInteractionHandler,
	setActiveButton,
	toggleExpandSubcontents,
	entityName
}) => {
	const { t } = useTranslation();
	const [textareaValue, setTextAreaValue] = useState('');
	const textareaRef = useRef<NativeComponent>(null);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [scrollViewContainerHeight, setScrollViewContainerHeight] = useState(
		100
	);
	const dispatch = useDispatch();
	const { ccToConnector, role }: IOppOverViewSelector = useSelector(
		oppOverviewSelector
	);
	// useEffect(() => {
	// 	Keyboard.addListener('keyboardDidShow', keyboardListener);
	// 	Keyboard.addListener('keyboardDidHide', keyboardListener);
	// 	return () => {
	// 		Keyboard.removeListener('keyboardDidShow', keyboardListener);
	// 		Keyboard.removeListener('keyboardDidHide', keyboardListener);
	// 	};
	// }, []);

	const keyboardListener = useCallback(
		e => {
			const height = e.endCoordinates.height;
			setKeyboardHeight(height);
		},
		[keyboardHeight]
	);

	// useEffect(() => {
	// 	textareaRef.current!.focus();
	// }, [textareaRef.current]);

	return (
		<S.Container>
			<S.ScrollTextareaContainer>
				<S.Textarea
					placeholder={t(`${translationPrefix}.placeholder`, {
						username: entityName
					})}
					value={textareaValue}
					onChange={setTextAreaValue}
					ref={textareaRef}
					scrollEnabled={true}
				/>
			</S.ScrollTextareaContainer>
			<S.ControlsContainer keyboardHeight={keyboardHeight}>
				{role !== EntityEnum.CONNECTOR && (
					<S.SwitchContainer>
						<>
							<SwitchOnAndOff
								onToggle={value => dispatch(ccToConnectorToggle(value))}
								isOn={ccToConnector}
							/>
							<S.CCText
								text={t(`${translationPrefix}.ccTheConnector`)}
								size='s12'
								color='darkerBlue1'
							/>
						</>
					</S.SwitchContainer>
				)}
				<SubmitButton
					disabled={!textareaValue}
					onPress={() => {
						sendInteractionHandler({
							body: textareaValue,
							isPredefinedMessage: false
						});
						setTextAreaValue('');
					}}
					gradientBackground='orange'
					upperCase={false}
					text={t(`${translationPrefix}.sendMessage`)}
					width='100%'
				/>
			</S.ControlsContainer>
		</S.Container>
	);
};

const S: any = {};

S.Container = styled.View`
	flex: 1;
	height: ${deviceHeight * 0.89};
	align-items: center;
	justify-content: flex-start;
	background-color: white;
	padding-top: 11%;
`;
S.ScrollTextareaContainer = styled(ScrollView).attrs({
	contentContainerStyle: {
		paddingHorizontal: calcWidth(25)
	}
})`
	flex: 1;
	width: 100%;
	max-height: 80%;
`;
S.Textarea = styled(Textarea)`
	font-size: ${calcFontSize(15)};
	border-width: 0;
	flex: 1;
	width: 100%;
`;

S.ControlsContainer = styled.View<{ keyboardHeight: number }>`
	/* position: absolute;
	bottom: 0; */
	width: 100%;
	aspect-ratio: 3.42;
	/* ${({ keyboardHeight }) =>
		keyboardHeight && `transform: translateY(-${keyboardHeight}px);`}; */
`;

S.SwitchContainer = styled.View`
	flex-direction: row;
	justify-content: flex-start;
`;

S.CCText = styled(CustomText)`
	transform: translateX(${deviceWidth * 0.1}px)
		translateY(${deviceWidth * 0.01}px);
`;

export default TargetProfileMessages;
