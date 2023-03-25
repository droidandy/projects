import React from 'react';
import styled from 'styled-components/native';
import { useAudioPlayer } from '../../hooks';
import CustomText from './CustomText';
import { ActivityIndicator } from 'react-native';

interface IProps {
	filePath?: string;
	base64?: string;
}

const AudioPlayer: React.FC<IProps> = props => {
	const { filePath, base64 } = props;
	const value = filePath ? filePath : base64;
	const key = filePath ? 'filePath' : 'base64';

	const { isPlayerReady, pause, play } = useAudioPlayer({
		[key]: value,
		onError() {},
		onPause: () => {},
		onPlay: () => {},
		whilePlaying: () => {}
	});

	return (
		<S.Container>
			{isPlayerReady ? (
				<S.Container>
					<CustomText
						text='Play'
						touchable
						onPress={play}
						size='s18'
						withRightGap
					/>
					<CustomText text='Pause' touchable onPress={pause} size='s18' />
				</S.Container>
			) : (
				<ActivityIndicator />
			)}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: center;
`;

export default AudioPlayer;
