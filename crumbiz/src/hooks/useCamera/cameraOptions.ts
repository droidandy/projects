import { ImagePickerOptions } from 'react-native-image-picker';
export const defaultOptions: ImagePickerOptions = {
	title: 'Profile Photo',
	takePhotoButtonTitle: 'Camera',
	chooseFromLibraryButtonTitle: 'Gallery',
	quality: 0.6,
	customButtons: [{ name: 'deletePhoto', title: 'Remove photo' }],
	storageOptions: {
		skipBackup: true,
		path: 'images'
	},
	allowsEditing: false,
	maxHeight: 500,
	maxWidth: 500
};
