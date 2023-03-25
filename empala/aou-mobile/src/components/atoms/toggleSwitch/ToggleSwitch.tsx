import React, { useState, useCallback } from 'react';

import * as s from './toggleSwitchStyles';

import Theme from '~/theme';

type Props = {
  data: {
    title: string;
    id: string;
  }[];
  initialActiveId?: string;
  onChanged: (id: string) => void
};

export const ToggleSwitch = ({ data, initialActiveId, onChanged }: Props): JSX.Element => {
  const [activeId, setActiveId] = useState(initialActiveId);
  const onItemPress = useCallback((id: string) => {
    setActiveId(id);
    onChanged(id);
  }, [onChanged]);

  return (
    <Theme>
      <s.Container>
        {data.map(({ title, id }) => {
          const active = activeId === id;
          return (
            <s.Item
              active={active}
              onPress={() => onItemPress(id)}
              key={id}
            >
              <s.Title active={active}>{title}</s.Title>
            </s.Item>
          );
        })}
      </s.Container>
    </Theme>
  );
};
