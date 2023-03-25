import styled from 'styled-components/native';

export const Wrapper = styled.View`
  width: 100%;
`;

export const Name = styled.Text`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }): string => theme.colors.GreyGull};
  margin-top: 19px;
`;

export const List = styled.View`
  width: 100%;
`;

export const ListItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  min-height: 50px;
  margin-top: 10px;
`;

export const ListItemUnderline = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 1px;
  width: 100%;
  background-color: ${({ theme }): string => theme.colors.Black};
  opacity: 0.2;
`;

export const ListItemMainText = styled.Text`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }): string => theme.colors.Black};
`;

export const ListItemSecondText = styled.Text`
  font-weight: 400;
  font-size: 11px;
  line-height: 16px;
  color: #CBD5E1;
`;

export const StatusWrapper = styled.View`
  min-width: 90px;
  align-items: flex-end;
`;
