import React, { useCallback, useMemo, useState } from 'react';
import { LayoutRectangle, StyleSheet } from 'react-native';

import * as s from './styles';

export type Option = {
  id: string | number;
  label: string;
};

type Props = {
  activeOptionId: string | number;
  options: Option[];
  onSelect: (optionId: string | number) => void;
};

export const Dropdown = ({ activeOptionId, options, onSelect }: Props): JSX.Element => {
  const activeOption = useMemo(
    () => options.find((option) => option.id === activeOptionId),
    [activeOptionId, options],
  );

  const [listOpened, setListOpened] = useState(false);
  const toggleList = useCallback(() => {
    setListOpened(!listOpened);
  }, [listOpened]);

  const handleSelectOption = useCallback((optionId: string | number) => {
    setListOpened(false);
    onSelect(optionId);
  }, [onSelect]);

  const [buttonLayoutRect, setButtonLayoutRect] = useState<LayoutRectangle>();

  return (
    <s.Wrapper>
      <s.Button
        onPress={toggleList}
        onLayout={(event) => setButtonLayoutRect(event.nativeEvent.layout)}
      >
        <s.Label>{activeOption?.label}</s.Label>
        <s.Arrow
          style={{ transform: [{ rotate: listOpened ? '180deg' : '0deg' }] }}
        />
      </s.Button>
      {listOpened && (
        <s.List buttonLayoutRect={buttonLayoutRect} style={styles.list}>
          {options.map(({ id, label }) => (
            <s.ListItem key={id} onPress={() => handleSelectOption(id)}>
              <s.Label>
                {label}
              </s.Label>
            </s.ListItem>
          ))}
        </s.List>
      )}
    </s.Wrapper>
  );
};

const styles = StyleSheet.create({
  list: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
