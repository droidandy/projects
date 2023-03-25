import React, { useEffect } from 'react';

import * as s from './ActionStyles';

import { Icon } from '~/components/atoms/icon';
import Theme from '~/theme';

type Props = {
  active?: boolean;
  onPress: (isActive: boolean) => void;
};

export const Action = ({ active = false, onPress }: Props): JSX.Element => {
  const [isActive, setIsActive] = React.useState<boolean>(active);

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  const handlePress = React.useCallback(
    () => {
      onPress(!isActive);
      setIsActive(!isActive);
    },
    [isActive, setIsActive],
  );

  return (
    <Theme>
      <s.Container isActive={isActive} onPress={handlePress}>
        <Icon name={isActive ? 'minus' : 'plus'} size={21} color="#fff" />
      </s.Container>
    </Theme>
  );
};
