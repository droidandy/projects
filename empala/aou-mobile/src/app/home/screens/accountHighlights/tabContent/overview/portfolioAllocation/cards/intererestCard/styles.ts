import styled from 'styled-components/native';

import { ImagePlaceholder } from '~/assets/icons/lib/imagePlaceholder';
import { FillableContainer } from '~/components/atoms/fillableContainer';

export const Wrapper = styled(FillableContainer)`
  margin-top: 10px;
  border-radius: 16px;
  width: 100%;
  overflow: hidden;
  background-color: #E2E8F0;
  height: 132px;
`;

export const Content = styled.View`
  align-items: center;
  justify-content: space-between;
  padding: 5px 12px 14px 8px;
  width: 100%;
  height: 100%;
`;

export const TopPart = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

export const TopRightPart = styled.View`
  align-items: flex-end;
`;

export const PercentageAndAvatarWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  height: 24px;
`;

export const AvatarPlaceholder = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ theme }): string => theme.colors.Grey600};
  margin-left: 6px;
`;

export const ChartWrapper = styled.View`
  margin-top: 10px;
  margin-right: 5px;
  height: 30px;
`;

export const ValuesWrapper = styled.View`
  align-items: flex-start;
`;

export const Name = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: ${({ theme }): string => theme.colors.Grey800};
`;

export const TotalValueWrapper = styled.View`
  margin-top: 14px;
`;

export const TotalValueLabel = styled.Text`
  font-weight: 500;
  font-size: 8px;
`;

export const TotalValue = styled.Text`
  color: ${({ theme }): string => theme.colors.Grey800};
  font-weight: bold;
  font-size: 13px;
`;

export const BottomPart = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
`;

export const Companies = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CompaniesCount = styled.View`
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${({ theme }): string => theme.colors.Grey600};
`;

export const Investacks = styled(Companies)`
  margin-left: 16px;
`;

export const CompaniesCountLabel = styled.Text`
  color: ${({ theme }): string => theme.colors.White};
  font-weight: 800;
  font-size: 11px;
`;

export const CompaniesLabel = styled.Text`
  margin-left: 6px;
  color: ${({ theme }): string => theme.colors.Grey400};
  font-size: 11px;
`;

export const BottomRightIconsWrapper = styled.View`
  flex-direction: row;
`;

export const BottomRightImage = styled(ImagePlaceholder)`
  margin-left: 4px;
`;
