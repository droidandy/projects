import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import styled from 'styled-components/native';

import { RootStackParamList } from '~/app/home/navigation/types';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const Btn = styled.TouchableOpacity`
  margin-top: 15px;
  padding: 15px 0;
`;

const BtnText = styled.Text`
  font-size: 14px;
  color: #2e78b7;
`;

export default function NotFoundScreen({ navigation }: StackScreenProps<RootStackParamList, 'NotFound'>): JSX.Element {
  return (
    <Container>
      <Title>This screen doesn't exist.</Title>
      <Btn onPress={() => navigation.replace('Root')}>
        <BtnText>Go to home screen!</BtnText>
      </Btn>
    </Container>
  );
}
