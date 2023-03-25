import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { KeyboardAvoidingView } from 'react-native';

import * as s from './modalPageStyles';

import { CloseButton } from '~/components/atoms/closeButton';
import { Modals } from '~/constants/modalScreens';

type ModalPageProps = {
  id: Modals,
  title?: string,
  fullscreen?: boolean;
};

export const ModalPage: React.FC<ModalPageProps> = ({
  children,
  title,
  fullscreen,
}): JSX.Element => {
  const navigation = useNavigation();

  if (fullscreen) {
    return (
      <s.Container>
        {children}
      </s.Container>
    );
  }

  return (
    <s.Container>
      <s.CloseOverlay onPress={() => navigation.goBack()} />
      <s.HeaderContainer>
        <s.HeaderTitle>
          {title}
        </s.HeaderTitle>

        <CloseButton onPress={() => navigation.goBack()} />
      </s.HeaderContainer>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ width: '100%' }}
        keyboardVerticalOffset={48}
      >
        <s.SafeAreaContainer edges={['bottom', 'right', 'left']}>
          {children}
        </s.SafeAreaContainer>

      </KeyboardAvoidingView>
    </s.Container>
  );
};
