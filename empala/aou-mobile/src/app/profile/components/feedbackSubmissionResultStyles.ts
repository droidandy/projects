import styled from 'styled-components/native';

import { Icon } from '~/components/atoms/icon';

export const Container = styled.View`
    flex:1;
    align-items: center;
    justify-content: center;
    padding: 0px 16px;
`;

export const Content = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

export const Image = styled(Icon)`
    
`;

export const Title = styled.Text`
    margin-top: 35px;
    font-weight: bold;
    font-size: 28px;
    color: ${({ theme }) => theme.formatterColor.Dark800}
`;

export const Subtitle = styled.Text`
    margin-top: 3px;
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.formatterColor.Dark400}
`;

export const Btn = styled.View`
  flex-shrink: 1;
  width: 100%;
  margin: 17px 0px;
`;
