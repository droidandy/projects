import { useState } from 'react';
import ImagePicker, { ImagePickerOptions } from 'react-native-image-picker';
import useAsyncEffect from '../useAsyncEffect';
import { getCameraPermission, getCameraRollPermission } from './permissions';
import { defaultOptions } from './cameraOptions';
import { PlainFunction } from '../../types/interfaces';
interface ICameraProps {
	options?: ImagePickerOptions;
	photoSelectionCB: PlainFunction;
	deletePhotoCB?: PlainFunction;
}
interface IPhotoSelectionCB {
	photoSelectionCB: PlainFunction;
}
const useCamera = (cameraProps: ICameraProps) => {
	const { options, photoSelectionCB, deletePhotoCB } = cameraProps;

	const showImagePicker = async () => {
		ImagePicker.showImagePicker(defaultOptions, response => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				if (response.customButton === 'deletePhoto') {
					typeof deletePhotoCB === 'function' && deletePhotoCB();
				}
				console.log('User tapped custom button: ', response.customButton);
			} else {
				const source = { uri: response.uri };
				photoSelectionCB(response);
			}
		});
	};
	const launchCamera = () => {
		ImagePicker.launchCamera(defaultOptions, photoSelectionCB);
	};
	const launchImageLibrary = () => {
		ImagePicker.launchImageLibrary(defaultOptions, photoSelectionCB);
	};
	return { showImagePicker, launchCamera, launchImageLibrary };
};
export default useCamera;
