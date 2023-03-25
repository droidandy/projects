/* eslint-disable @typescript-eslint/naming-convention */
import RNBubbleSelect, { Bubble, BubbleNode, BubbleProps } from '@dehimer/react-native-bubble-select';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { theme } from '~/theme';

type BubbleType = BubbleProps & BubbleNode;

export const useBubble = () => {
  const [selected, setSelected] = React.useState<BubbleNode[]>([]);

  const onSelect = (bubble: BubbleNode) => {
    setSelected((oldSelected) => [...oldSelected, bubble]);
  };

  const onDeselect = (bubble: BubbleNode) => {
    setSelected(selected.filter(({ id }) => id !== bubble.id));
  };

  const calculateFontSize = (text: string): number => Math.max(18 - text.length / 2, 10);

  // used as a hack to solve the issue with not all the bubbles being shown
  // https://github.com/jesster2k10/react-native-bubble-select/issues/2
  const BUBBLE_SHOW_DELAY = 1000;

  const BubbleSelect = React.useCallback(
    ({ data = [], allowsMultipleSelection, initialSelection = [] }: {
      data: BubbleType[], allowsMultipleSelection: boolean, initialSelection?: string[]
    }) => {
      const [bubbles, setBubbles] = useState<BubbleType[]>([]);

      useEffect(() => {
        if (Platform.OS === 'ios') {
          setTimeout(() => setBubbles(data), BUBBLE_SHOW_DELAY);
        } else {
          setBubbles(data);
        }
      }, [data]);

      return (
        <RNBubbleSelect
          allowsMultipleSelection={allowsMultipleSelection}
          backgroundColor="transparent"
          onSelect={onSelect}
          onDeselect={onDeselect}
          width="100%"
          height="100%"
          style={{ flexGrow: 1 }}
          initialSelection={initialSelection}
        >
          {bubbles.map((v: BubbleType) => (
            <Bubble
              key={v.id}
              id={v.id}
              text={v.text}
              color={v.color || theme.formatterColor.Bubble}
              selectedColor={v.selectedColor || theme.colors.White}
              fontColor={v.fontColor || theme.colors.White}
              selectedFontColor={v.selectedFontColor || theme.colors.Dark}
              selectedScale={v.selectedScale || 1.2}
              autoSize
              fontSize={calculateFontSize(v.text)}
              padding={10}
            />
          ))}
        </RNBubbleSelect>
      );
    },
    [],
  );

  return {
    selected, setSelected, onSelect, onDeselect, BubbleSelect,
  };
};
