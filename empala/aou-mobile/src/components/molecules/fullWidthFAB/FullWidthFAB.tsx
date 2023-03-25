import React, { useState, useCallback } from 'react';

import * as s from './fullWidthFABStyles';

import Theme from '~/theme';

type Button = {
  key: string | number;
  text: string;
  onPress: () => void;
};

type Props = {
  mainButtonText: string;
  buttons: Button[];
};

export const TradeButton = ({ mainButtonText, buttons }: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  const onMainButtonPress = useCallback(() => setExpanded((prev) => !prev), []);

  return (
    <Theme>
      <s.Container>
        {expanded && buttons.map(({ text, onPress, key }, index) => (
          <React.Fragment key={key}>
            <s.SecondaryButton
              title={text}
              onPress={onPress}
            />
            {(index !== buttons.length - 1) && <s.ButtonSeparator />}
          </React.Fragment>
        ))}
        <s.ButtonSeparator />
        <s.MainButton
          title={mainButtonText}
          expanded={expanded}
          onPress={onMainButtonPress}
        />
      </s.Container>
    </Theme>
  );
};
