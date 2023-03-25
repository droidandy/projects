import React, { useCallback } from 'react';
import { useTheme } from 'styled-components/native';

import * as s from './profileItemStyles';

import { Icon } from '~/components/atoms/icon';

type Props = {
  text: string;
  subText?: string;
  withDivider?: boolean;
  face: s.FaceType;
  onPress?: () => void,
};

export const ProfileItem = ({
  text,
  subText,
  withDivider = true,
  face = s.FaceType.primary,
  onPress,
}: Props): JSX.Element => {
  const { colors, formatterColor } = useTheme();
  const iconColor = {
    [s.FaceType.primary]: colors.Grey600,
    [s.FaceType.secondary]: formatterColor.Light600,
    [s.FaceType.tertiary]: colors.Grey600,
  };
  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <s.Container>
      <s.Row onPress={handlePress}>
        <s.Text face={face}>{text}</s.Text>
        <Icon name="rightArrow" color={iconColor[face] || colors.Grey600} />
      </s.Row>
      {subText && (
        <s.SubText>{subText}</s.SubText>
      )}
      {withDivider && (<s.Separator />)}
    </s.Container>
  );
};
