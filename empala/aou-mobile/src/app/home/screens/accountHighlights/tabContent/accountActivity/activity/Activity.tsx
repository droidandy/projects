import React, { useMemo } from 'react';

import { ActivityNameAndType, ActivityValueAndDate, ImageWrapper } from './styles';

import { Activity as ActivityType } from '~/app/home/screens/accountHighlights/tabContent/accountActivity/types';
import * as s from '~/app/home/screens/accountHighlights/tabContent/section/styles';

type Props = {
  activity: ActivityType;
  onPress?: () => void;
};

export const Activity = ({ activity, onPress }: Props): JSX.Element => {
  const formattedOrderStatusDate = new Date(activity.date).toLocaleDateString('ko-KR');
  const value = useMemo(() => {
    if (typeof activity.value === 'number') {
      return `${activity.value < 0 ? '- ' : '+ '}$${Math.abs(activity.value)}`;
    }

    return activity.value;
  }, [activity]);

  return (
    <s.ListItem onPress={onPress}>
      <ImageWrapper>
        {activity.image}
      </ImageWrapper>
      <ActivityNameAndType>
        <s.ListItemMainText>{activity.name}</s.ListItemMainText>
        <s.ListItemSecondText>{activity.type}</s.ListItemSecondText>
      </ActivityNameAndType>
      <ActivityValueAndDate>
        <s.ListItemMainText>{value}</s.ListItemMainText>
        <s.ListItemSecondText>{formattedOrderStatusDate}</s.ListItemSecondText>
      </ActivityValueAndDate>
    </s.ListItem>
  );
};
