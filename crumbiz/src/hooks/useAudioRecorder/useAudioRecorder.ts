import { useCallback, useEffect, useRef } from 'react';
import { PlainFunction } from '../../types/interfaces';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import getRecordingPermission from './getRecordingPermission';
import { DeviceEventEmitter, Platform } from 'react-native';
import formatRecordingTime from './formatRecordingTime';
import { generateUniqueId } from '../../utils';

interface IParams {
	onError: PlainFunction;
	onRecordingStart: PlainFunction;
	onRecordingStop: PlainFunction<string>;
	onRecordingPause: PlainFunction;
	onRecordingResume: PlainFunction;
	onRecordingDelete: PlainFunction;
	whileRecording: PlainFunction<{
		currentTimeInSecs: number;
		formattedTime: string;
	}>;
}

interface IStopRecordingPrivateParams {
	_shouldCallOnRecordingStopCallback?: boolean;
}

const audioDirectory = AudioUtils.DocumentDirectoryPath;
const audioPath = `${audioDirectory}/crumbiz-${generateUniqueId()}.aac`;
const useAudioRecorder = ({
	onError,
	onRecordingStart,
	onRecordingPause,
	onRecordingStop,
	onRecordingDelete,
	onRecordingResume,
	whileRecording
}: IParams) => {
	let hasInited = useRef(false).current;
	let isPaused = useRef(false).current;
	let isRecording = useRef(false).current;

	useEffect(() => {
		return () => {
			if (isRecording) {
				AudioRecorder.stopRecording();
				_clearEventsAndResetIndicators();
			}
		};
	}, []);

	const _handleProgress = useCallback(e => {
		whileRecording({
			currentTimeInSecs: e.currentTime,
			formattedTime: formatRecordingTime(e.currentTime)
		});
	}, []);

	const _clearEventsAndResetIndicators = useCallback(() => {
		hasInited = false;
		isPaused = false;
		isRecording = false;
		DeviceEventEmitter.removeListener('recordingProgress', _handleProgress);
	}, []);

	const __init__ = useCallback(async () => {
		try {
			if (hasInited) return;
			await getRecordingPermission();
			await AudioRecorder.prepareRecordingAtPath(audioPath, {
				SampleRate: 22050,
				Channels: 1,
				AudioQuality: 'Low',
				AudioEncoding: 'aac',
				OutputFormat: 'aac_adts'
			});

			DeviceEventEmitter.addListener('recordingProgress', _handleProgress);

			// TODO Sason - might need to use onFinished to handle iOS.
			AudioRecorder.onFinished = data => {
				if (Platform.OS === 'ios') {
					onRecordingStop(data.audioFileURL);
				}
			};

			hasInited = true;
		} catch (ex) {
			onError(ex);
		}
	}, []);

	const _resumeRecording = useCallback(async () => {
		try {
			await AudioRecorder.resumeRecording();
			onRecordingResume();
			isPaused = false;
		} catch (ex) {
			onError(ex);
		}
	}, []);

	const startRecording = useCallback(async () => {
		try {
			if (isPaused) {
				_resumeRecording();
				return;
			}

			if (!hasInited) {
				await __init__();
			}

			if (!isRecording) {
				await AudioRecorder.startRecording();
				onRecordingStart();
			}

			isRecording = true;
		} catch (ex) {
			onError(ex);
		}
	}, []);

	const pauseRecording = useCallback(async () => {
		try {
			await AudioRecorder.pauseRecording();
			onRecordingPause();
			isPaused = true;
		} catch (ex) {
			onError(ex);
		}
	}, []);

	const stopRecording = useCallback(
		async ({
			_shouldCallOnRecordingStopCallback = true
		}: IStopRecordingPrivateParams) => {
			try {
				const filePath = await AudioRecorder.stopRecording();
				if (_shouldCallOnRecordingStopCallback && Platform.OS === 'android') {
					onRecordingStop(filePath);
				}
				_clearEventsAndResetIndicators();
			} catch (ex) {
				onError(ex);
			}
		},
		[]
	);

	const deleteRecording = useCallback(async () => {
		await stopRecording({ _shouldCallOnRecordingStopCallback: false });
		onRecordingDelete();
	}, []);

	return { startRecording, pauseRecording, stopRecording, deleteRecording };
};

export default useAudioRecorder;
