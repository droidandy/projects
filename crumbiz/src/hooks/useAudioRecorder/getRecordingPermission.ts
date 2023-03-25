import { PERMISSIONS, request, check } from 'react-native-permissions';
import { Platform } from 'react-native';

async function getRecordingPermission(): Promise<Boolean> {
	try {
		const { WRITE_EXTERNAL_STORAGE, RECORD_AUDIO } = PERMISSIONS.ANDROID;

		const { MICROPHONE, MEDIA_LIBRARY } = PERMISSIONS.IOS;

		const microphoneSelector = Platform.select({
			ios: MICROPHONE,
			android: RECORD_AUDIO
		});

		const storageSelector = Platform.select({
			ios: MEDIA_LIBRARY,
			android: WRITE_EXTERNAL_STORAGE
		});

		let microphone = await check(microphoneSelector);

		if (microphone !== 'granted') {
			await request(microphoneSelector);
		}

		let storage = await check(storageSelector);

		if (storage !== 'granted') {
			await request(storageSelector);
		}

		return true;
	} catch (ex) {
		return false;
	}
}

export default getRecordingPermission;
