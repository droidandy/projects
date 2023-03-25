import styled from 'styled-components/native';

import { SectionHeader as SectionHeaderComponent } from '~/components/atoms/sections';
import { Filters as FiltersComponent } from '~/components/molecules/filters';

export const Wrapper = styled.View`
  flex: 1;
  padding-left: 16px;
  padding-right: 25px;
`;

export const SectionHeader = styled(SectionHeaderComponent)`
  padding-top: 21px;
  padding-bottom: 22px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderText = styled.Text`
  font-family: 'Inter_800ExtraBold';
  font-size: 24px;
  line-height: 34px;
`;

export const Filters = styled(FiltersComponent)`
  margin-top: 10px;
`;
