import React from 'react';
import { StyleSheet } from 'react-native';
import Video from 'react-native-video';

import * as Styles from './module.styles';

import { Button } from '~/components/atoms/button';
import { Icon } from '~/components/atoms/icon';
import layout from '~/constants/Layout';
import { useGetThemesQuery } from '~/graphQL/core/generated-types';
import { signin, signup } from '~/store/auth';
import { useAppDispatch } from '~/store/hooks';

type Props = {
  title?: string;
};

const { width, height } = layout;

const styles = StyleSheet.create({
  backgroundVideo: {
    height,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'stretch',
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
});

export const Welcome = (properties: Props): JSX.Element => {
  const [paused, setPaused] = React.useState(true);
  const { loading, error, data } = useGetThemesQuery();
  const dispatch = useAppDispatch();

  const onGetStartedPress = () => {
    dispatch(signup());
  };

  const onLoginPress = () => {
    dispatch(signin());
  };
  console.log('-->', loading, error, data);
  return (
    <Styles.Container>
      <Video
        style={styles.backgroundVideo}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        source={require('./video1.mp4')}
        muted={false}
        repeat
        paused={paused}
        resizeMode="cover"
        posterResizeMode="cover"
        rate={1.0}
        ignoreSilentSwitch="obey"
      />
      <Styles.Layout>
        <Styles.Bottom>
          <Icon name="cover" width={width} height={height * 0.55} />
        </Styles.Bottom>
      </Styles.Layout>
      <Styles.Content>
        <Styles.Control onPress={() => setPaused(!paused)}>
          <Icon name={paused ? 'play' : 'pause'} size={34} />
        </Styles.Control>
        <Styles.TextContainer>
          <Styles.Label>What are you</Styles.Label>
          <Styles.Label>curious about?</Styles.Label>
        </Styles.TextContainer>
        <Styles.ButtonsContainer>
          <Button title="GET STARTED" face="secondary" onPress={onGetStartedPress} />
          <Button title="LOG IN" face="third" onPress={onLoginPress} />
        </Styles.ButtonsContainer>
      </Styles.Content>
    </Styles.Container>
  );
};
