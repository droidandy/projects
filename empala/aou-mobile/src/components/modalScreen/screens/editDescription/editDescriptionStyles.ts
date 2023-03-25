import styled from 'styled-components/native';

export const Container = styled.View`
  justify-content: space-between;
  align-items: center;
`;

export const BodyContainer = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-left: 25px;
  padding-right: 32px;
  padding-bottom: 27px;
`;

export const ButtonsContainer = styled.View`
  width: 90%;
  justify-content: space-between;
`;

export const EditField = styled.TextInput`
  flex: 1;
  height: 100px;
  font-size: 16px;
  line-height: 22px;
  font-weight: 500;
  font-family: 'Inter_500Medium';
  color: white;
`;
