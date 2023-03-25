import styled from 'styled-components/native';

export const Wrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-left: 33px;
  padding-right: 22px;
  padding-bottom: 20px;
  width: 100%;
`;

export const RowView = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const PercentAndDate = styled.Text`
  color: ${({ theme }) => theme.colors.White};
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
`;

export const AuthorName = styled.Text`
  color: ${({ theme }) => theme.colors.White};
  margin-right: 8px;
  opacity: 0.8;
  font-size: 14px;
  font-weight: 500;
`;

export const Avatar = styled.Image`
  width: 24px;
  height: 24px;
`;
