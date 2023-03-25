import styled from 'styled-components/native';

export const Container = styled.View`
    flex-direction: row;
`;

export const Item = styled.TouchableOpacity<{ active: boolean }>`
    padding: 8px 16px;
    border: 1px;
    background-color: ${({ theme, active }) => (active ? theme.colors.White : theme.colors.GreyDarkest)};
`;

export const Title = styled.Text<{ active: boolean }>`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: ${({ theme, active }) => (active ? theme.colors.GreyDarkest : theme.colors.White)};
`;
