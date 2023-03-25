import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 75%;
  opacity: 0.7;
`;

export const Text = styled.Text`
  font-size: 13px;
  line-height: 18px;
  text-align: center;
  color: white;
`;

export const Link = styled(Text)`
  text-decoration: underline;
  text-decoration-color: white;
`;
