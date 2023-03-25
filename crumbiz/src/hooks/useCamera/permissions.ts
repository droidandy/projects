import { Platform } from 'react-native';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
const { CAMERA, READ_EXTERNAL_STORAGE } = PERMISSIONS.ANDROID;
const { CAMERA: IOS_CAMERA, PHOTO_LIBRARY } = PERMISSIONS.IOS;
const cameraSelector = Platform.select({
	ios: IOS_CAMERA,
	android: CAMERA
});
const cameraRollSelector = Platform.select({
	ios: PHOTO_LIBRARY,
	android: READ_EXTERNAL_STORAGE
});
export const getCameraPermission = async () => {
	let cameraPermission = false;
	try {
		const cameraPermStatus = await check(cameraSelector);
		if (cameraPermStatus !== RESULTS.GRANTED) {
			const cameraPerm = await request(cameraSelector);
			if (cameraPerm === 'granted') cameraPermission = true;
		}
	} catch (error) {
		console.log('Error handeling camera permission');
	}
	return cameraPermission;
};
export const getCameraRollPermission = async () => {
	let cameraRollPermission = false;
	try {
		const cameraRollStatus = await check(cameraRollSelector);
		if (cameraRollStatus !== RESULTS.GRANTED) {
			const cemeraRollPerm = await request(cameraRollSelector);
			if (cemeraRollPerm === 'granted') cameraRollPermission = true;
		}
	} catch (ex) {
		console.log('Error accessing permissions');
	}
	return cameraRollPermission;
};
