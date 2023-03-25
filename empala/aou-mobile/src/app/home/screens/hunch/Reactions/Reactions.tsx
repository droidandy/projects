import React, { ReactElement, useCallback } from 'react';

import { Button } from './Button';
import {
  BallIcon,
  FingerIcon,
  OkIcon, PlusIcon,
  RetchIcon,
  SadIcon,
  StarIcon,
  SunIcon,
} from './Icons';
import * as s from './styles';

type ReactionType = {
  id: string;
  icon: ReactElement;
  count: number;
};

const MOCKED_REACTIONS: ReactionType[] = [
  {
    id: '1',
    icon: <OkIcon />,
    count: 2,
  },
  {
    id: '2',
    icon: <StarIcon />,
    count: 22,
  },
  {
    id: '3',
    icon: <SunIcon />,
    count: 3,
  },
  {
    id: '4',
    icon: <SadIcon />,
    count: 5,
  },
  {
    id: '5',
    icon: <RetchIcon />,
    count: 56,
  },
  {
    id: '6',
    icon: <BallIcon />,
    count: 13,
  },
  {
    id: '7',
    icon: <FingerIcon />,
    count: 11,
  },
];

export const Reactions = () => {
  const handleAddReactionPress = useCallback(() => {
    console.log('handleAddReactionPress');
  }, []);

  const handleReactionPress = useCallback((id?: string) => {
    console.log('handleReactionPress', id);
  }, []);

  return (
    <s.Wrapper>
      <s.ReactionsWrapper>
        {MOCKED_REACTIONS.map(({ id, icon, count }) => (
          <Button
            key={id}
            id={id}
            icon={icon}
            label={count}
            onPress={handleReactionPress}
          />
        ))}
      </s.ReactionsWrapper>
      <s.AddReactionButton
        label="Add Reaction"
        icon={<PlusIcon />}
        onPress={handleAddReactionPress}
      />
    </s.Wrapper>
  );
};
