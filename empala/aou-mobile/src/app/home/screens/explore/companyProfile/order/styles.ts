import styled from 'styled-components/native';

export const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 88px;
  border-radius: 16px;
  background-color: ${({ theme }): string => theme.formatterColor.Light900};
  overflow: hidden;
  border: 1px solid #eee; // TODO should be removed, when parent will get non same background 
`;

export const LeftPart = styled.View`
  height: 100%;
  align-items: flex-start;
  padding-top: 15px;
  padding-left: 22px;
  padding-bottom: 12px;
`;

export const Company = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CompanyName = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: ${({ theme }): string => theme.colors.Black};
  margin-left: 9px;
`;

export const Value = styled.Text`
  font-weight: 800;
  font-size: 24px;
  margin-top: 15px;
  color: ${({ theme }): string => theme.colors.Black};
`;

export const RightPart = styled.View`
  height: 100%;
  align-items: flex-end;
  padding-top: 17px;
  padding-right: 15px;
`;

export const RightPartText = styled.Text`
  color: ${({ theme }): string => theme.formatterColor.Dark400};
  font-size: 12px;
  line-height: 16px;
`;

export const OrderType = styled(RightPartText)`
  font-weight: bold;
  font-size: 16px;
`;
