import RNFS from 'react-native-fs';

const readFile = async (filePath: string): Promise<string | undefined> => {
	try {
		const file = await RNFS.readFile(filePath, 'base64');
		return file as string;
	} catch (ex) {
		throw new Error(ex);
	}
};

export default readFile;
