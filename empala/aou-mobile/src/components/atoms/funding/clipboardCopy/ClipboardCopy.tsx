import Clipboard from 'expo-clipboard';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import * as Styled from './clipboardCopyStyles';

type Props = {
  text: string;
};

export const ClipboardCopy = ({ text }: Props): JSX.Element => {
  const copyToClipboard = () => {
    Clipboard.setString(text);
  };

  return (
    <Styled.Container>
      <TouchableOpacity onPress={copyToClipboard}>
        <Styled.Text>copy</Styled.Text>
      </TouchableOpacity>
    </Styled.Container>
  );
};
