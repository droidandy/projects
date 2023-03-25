import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const TitleContainer = styled.View`
  justify-content: center;
  margin-top: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;

export const Content = styled.View({
  flexGrow: 1,
  justifyContent: 'center',
});

export const TitleText = styled.Text`
  font-size: 36px;
  text-align: left;
`;
