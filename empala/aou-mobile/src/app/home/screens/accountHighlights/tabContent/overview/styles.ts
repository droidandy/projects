import styled from 'styled-components/native';

export const Wrapper = styled.ScrollView`
`;

export const ChartWrapper = styled.View`
  height: 370px;
  width: 100%;
`;

export const ValuesWrapper = styled.View`
  margin-top: 14px;
  width: 100%;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const Value = styled.Text`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.Black};
`;

export const ValueLabel = styled.Text`
  font-weight: 400;
  font-size: 11px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.Black};
`;

export const OtherLabel = styled.Text`
  margin-top: 34px;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  opacity: 0.5;
  color: ${({ theme }): string => theme.colors.Black};
`;