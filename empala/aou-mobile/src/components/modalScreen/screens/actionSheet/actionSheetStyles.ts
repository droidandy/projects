import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
    width: 100%;
    justify-content: space-between;
    padding-left: 16px;
    padding-right: 16px;
`;

export const ButtonContainer = styled.View`
    margin-bottom: 4px;
`;
