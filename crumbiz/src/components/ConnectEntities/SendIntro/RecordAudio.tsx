import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { Animated, TouchableWithoutFeedback, View } from 'react-native';
import {
	AnimatedOpacityView,
	RoundedIcon,
	StatusBar,
	Typography,
	SubmitButton,
	Button
} from '../../../components/Shared';
import { calcHeight, calcWidth } from '../../../utils/dimensions';
import {
	useAudioRecorder,
	useEffectAfterMount,
	useInterpolationGroup,
	useTheme
} from '../../../hooks';
import { createCircle, readFile, createShadow } from '../../../utils';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';
import { updateIntroAction } from '../../../store/actions/sendIntroActions';
import LinearGradient from 'react-native-linear-gradient';
import { ScreensEnum } from '../../../navigation/screens';

interface IProps {}

const initialRecordingTime = '0:00:00';
const RecordMessage: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const theme = useTheme();
	const dispatch = useDispatch();
	const [isRecording, setRecording] = useState(false);
	const [recordingTime, setRecordingTime] = useState(initialRecordingTime);
	const [hasRecorded, setHasRecorded] = useState(false);

	const resetCurrentRecordingTimeAndHasRecorded = useCallback(() => {
		setHasRecorded(false);
		setRecordingTime(initialRecordingTime);
		setRecording(false);
	}, []);

	const audioControls = useAudioRecorder({
		onRecordingStart: () => {
			setHasRecorded(true);
			setRecording(true);
		},
		whileRecording: params => {
			setRecordingTime(params!.formattedTime);
		},
		onRecordingPause() {
			setRecording(false);
		},
		onRecordingResume() {
			setRecording(true);
		},
		onRecordingStop: async filePath => {
			resetCurrentRecordingTimeAndHasRecorded();
			dispatch(updateIntroAction('recordingFilePath', filePath));
			dispatch(
				updateIntroAction('recordingBase64', await readFile(filePath as string))
			);
		},
		onRecordingDelete() {
			resetCurrentRecordingTimeAndHasRecorded();
			Animated.spring(animated, {
				toValue: 0,
				useNativeDriver: true,
				bounciness: 12
			}).start();
		},
		onError: ex => {
			throw new Error(ex);
		}
	});

	const animated = useRef(new Animated.Value(0)).current;

	const interpolationGroup = useInterpolationGroup(
		{
			animatedValue: animated,
			inputRange: [0, 1, 2],
			groups: {
				borderRadius: [100, 26, 100],
				scale: [1, 0.54, 0.54]
			}
		},
		[]
	);

	const navigation = useNavigation();

	const handlePress = useCallback(() => {
		isRecording
			? audioControls.pauseRecording()
			: audioControls.startRecording();
	}, [isRecording]);

	useEffectAfterMount(() => {
		Animated.spring(animated, {
			toValue: isRecording ? 1 : 2,
			useNativeDriver: true,
			bounciness: 12
		}).start();
	}, [isRecording]);

	return (
		<S.Container>
			<StatusBar backgroundColor='#ffffff' />
			<S.Content>
				<S.Header>
					{t('connectEntities.record.tapTo', {
						action: t(
							`connectEntities.record.${isRecording ? 'pause' : 'record'}`
						)
					})}
				</S.Header>

				<TouchableWithoutFeedback onPress={handlePress}>
					<S.RecordButton>
						<S.RecordButtonInner
							style={{
								borderRadius: interpolationGroup.borderRadius,
								transform: [
									{
										scale: interpolationGroup.scale
									}
								]
							}}
						>
							<S.Gradient colors={theme.gradients['orange']} />
						</S.RecordButtonInner>
					</S.RecordButton>
				</TouchableWithoutFeedback>

				<S.RecordButtonTime opacity={'30%'}>{recordingTime}</S.RecordButtonTime>

				<AnimatedOpacityView visible={hasRecorded && !isRecording}>
					<Button
						style={{
							borderRadius: 22,
							aspectRatio: 2.85
						}}
						width={calcWidth(100)}
						height={calcHeight(35)}
						applyRatio={true}
						text='Delete'
						textSize={14}
						onPress={audioControls.deleteRecording}
						backgroundColor={theme.colors.paleBlue3}
					/>
				</AnimatedOpacityView>
			</S.Content>

			<SubmitButton
				onPress={async () => {
					await audioControls.stopRecording({});
					navigation.navigate(ScreensEnum.ALL_SET);
				}}
				withBottomGap
				disabled={isRecording || !hasRecorded}
				gradientBackground='orange'
				gradientProps={{ useAngle: true, angle: 261 }}
				text='Next'
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background-color: #f0f2f8;
`;

S.Content = styled.View`
	justify-content: space-around;
	flex: 1;
`;

S.Header = styled(Typography.H4)`
	font-weight: normal;
	margin-top: ${calcHeight(30)};
`;

S.RecordButton = styled(Animated.View)`
	${createCircle(100)};
	align-self: center;
	justify-content: center;
	align-items: center;
`;

S.RecordButtonInner = styled(Animated.View)`
	${createCircle(100)};
	z-index: 2;
	position: absolute;
	overflow: hidden;
	/* ${createShadow({ elevation: 8 })} */
`;

S.Gradient = styled(LinearGradient)`
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
`;

S.RecordButtonTime = styled(Typography.H2)`
	font-weight: normal;
`;

S.PauseIconContainer = styled(Animated.View)`
	position: absolute;
	z-index: 2;
`;

S.TrashIcon = styled(RoundedIcon)`
	align-self: center;
`;

export default RecordMessage;
