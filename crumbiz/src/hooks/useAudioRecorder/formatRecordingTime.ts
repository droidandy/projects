const pad = (num: number): string => {
	return ('0' + num).slice(-2);
};

const formatRecordingTime = (sec: number): string => {
	const secs = Math.floor((sec * 1000) / 1000);
	const minutes = Math.floor(secs / 60);
	const hours = Math.floor(minutes / 60);
	const seconds = secs % 60;
	return `${hours}:${pad(minutes)}:${pad(seconds)}`;
};

export default formatRecordingTime;
