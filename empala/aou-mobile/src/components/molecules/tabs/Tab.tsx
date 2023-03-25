import React, { useCallback } from 'react';

import * as s from './styles';
import { Tab as TabType } from './types';

type Props = TabType & {
  active: boolean;
  onPress: (id: string | number) => void;
};

export const Tab = ({
  id,
  label,
  active,
  onPress,
}: Props): JSX.Element => {
  const handlePress = useCallback(() => {
    if (!active) {
      onPress(id);
    }
  }, [id, onPress, active]);

  return (
    <s.Tab onPress={handlePress}>
      <s.TabLabel active={active}>
        {label}
      </s.TabLabel>
    </s.Tab>
  );
};
