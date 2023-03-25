import styled from 'styled-components/native';

export const Container = styled.View`

`;

export const Item = styled.TouchableOpacity<{ active: boolean }>`
    background-color: ${({ theme, active }) => (active ? theme.colors.GreyDarkest : theme.colors.Grey200)};
    border-radius: 16px;
    padding: 7px 10px 5px 17px;
    margin-bottom: 7px;
`;

export const Title = styled.Text<{ active: boolean }>`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: ${({ theme, active }) => (active ? theme.colors.White : theme.colors.GreyDarkest)};
`;

export const Text = styled.Text<{ active: boolean }>`
    font-size: 14px;
    line-height: 24px;
    color: ${
  ({ theme, active }) => (active ? theme.colors.White : theme.colors.GreyDarkest)
};
`;
