import Sound from 'react-native-sound';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PlainFunction } from '../../types/interfaces';
import { afterTwoTicks, generateUniqueId } from '../../utils';
import { AudioUtils } from 'react-native-audio';
import RNFS from 'react-native-fs';
import { Alert, Platform } from 'react-native';
import { request, check, PERMISSIONS } from 'react-native-permissions';
import useAsyncEffect from '../useAsyncEffect';

interface IPrams {
	filePath?: string;
	base64?: string;
	onError: PlainFunction;
	onPlay: PlainFunction;
	onPause: PlainFunction;
	whilePlaying: PlainFunction;
}

const useAudioPlayer = ({
	filePath: filePathParam,
	base64,
	onError,
	onPlay,
	onPause
}: IPrams) => {
	const _soundRef = useRef<Sound>(null);
	let hasWrittenBase64ToDevice = useRef(false);
	const [filePath, setFilePath] = useState(filePathParam || null);
	const [isPlayerReady, setPlayerReady] = useState(false);

	useEffect(() => {
		return () => {
			if (_soundRef.current) _soundRef.current.release();
		};
	}, []);

	useEffect(() => {
		if (filePathParam && !filePath) {
			setFilePath(filePathParam);
		}
	}, [filePathParam, filePath]);

	useAsyncEffect(async () => {
		if (base64 && !hasWrittenBase64ToDevice.current) {
			try {
				hasWrittenBase64ToDevice.current = true;
				// prettier-ignore
				const audioPath = `${AudioUtils.DocumentDirectoryPath}/crumbiz-${generateUniqueId()}.aac`;

				const { WRITE_EXTERNAL_STORAGE } = PERMISSIONS.ANDROID;
				const { MEDIA_LIBRARY } = PERMISSIONS.IOS;

				const storageSelector = Platform.select({
					ios: MEDIA_LIBRARY,
					android: WRITE_EXTERNAL_STORAGE
				});

				let storage = await check(storageSelector);
				if (storage !== 'granted') {
					await request(storageSelector);
				}

				RNFS.writeFile(audioPath, base64, 'base64')
					.then(() => {
						const _filePath = Platform.select({
							ios: `file://${audioPath}`,
							android: audioPath
						});

						afterTwoTicks(() => {
							setFilePath(_filePath);
						});
					})
					.catch(ex => {
						onError(ex);
					});
			} catch (ex) {
				Alert.alert(
					'Permission denied',
					"We can't play the recording of this introduction.",
					[{ text: 'OK' }]
				);
				onError('Permission denied');
			}
		}

		if (filePath && !_soundRef.current) {
			setTimeout(() => {
				// @ts-ignore
				_soundRef.current = new Sound(filePath, '', error => {
					if (error) {
						onError(error);
						return;
					}
					setPlayerReady(true);
				});
			}, 100);
		}
	}, [filePath, _soundRef.current, base64]);

	const play = useCallback(() => {
		if (_soundRef.current) {
			setTimeout(() => {
				_soundRef.current!.play(success => {
					if (success) {
						onPlay();
					} else {
						onError(``);
					}
				});
			}, 100);
		}
	}, []);

	const pause = useCallback(() => {
		if (_soundRef.current) {
			_soundRef.current.pause(() => {
				onPause();
			});
		}
	}, []);

	return { play, pause, isPlayerReady };
};

export default useAudioPlayer;
