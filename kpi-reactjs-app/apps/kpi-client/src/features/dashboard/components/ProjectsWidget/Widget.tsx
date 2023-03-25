import * as React from 'react';
import styled from 'styled-components';
import { Box } from 'src/components/Box';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'src/components/Spinner';
import { PeriodPicker } from 'src/components/PeriodPicker';
import { useActions } from 'typeless';
import {
  ProjectsWidgetActions,
  getProjectsWidgetState,
} from './ProjectsWidget';
import { useProjectsChart } from './useProjectsChart';
import { Select } from 'src/components/Select';
import { SelectOption, OrganizationUnit } from 'src/types';
import { DisplayTransString } from 'src/components/DisplayTransString';

interface WidgetProps {
  className?: string;
}

const Top = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h5`
  line-height: 34px;
`;

const Content = styled.div`
  height: 450px;
`;

const SpinnerWrapper = styled(Content)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dropdowns = styled.div`
  display: flex;
`;

const DropdownWrapper = styled.div`
  width: 180px;
  margin-right: 10px;
`;

const _Widget = (props: WidgetProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const { changePeriod, changeUnit } = useActions(ProjectsWidgetActions);
  const {
    isLoading,
    period,
    stats,
    units,
    unit,
  } = getProjectsWidgetState.useState();
  const chartRef = useProjectsChart(stats, isLoading);
  const unitOptions = React.useMemo(() => {
    return units.map(x => {
      const option: SelectOption<OrganizationUnit> = {
        label: <DisplayTransString value={x.name} />,
        value: x,
      };
      return option;
    });
  }, [units]);

  return (
    <Box className={className}>
      <Top>
        <Title>{t('Projects Widget')}</Title>
        <Dropdowns>
          <PeriodPicker
            start={new Date().getFullYear() - 5}
            end={new Date().getFullYear()}
            value={period}
            minFrequency="Quarterly"
            onChange={value => {
              changePeriod(value);
            }}
          />
          <DropdownWrapper>
            <Select
              value={unit}
              options={unitOptions}
              placeholder={t('Organization Unit')}
              isClearable
              onChange={(value: any) => changeUnit(value)}
            />
          </DropdownWrapper>
        </Dropdowns>
      </Top>
      <Content>
        {isLoading ? (
          <SpinnerWrapper>
            <Spinner black size="40px" />
          </SpinnerWrapper>
        ) : (
          <div ref={chartRef} style={{ height: '100%' }} />
        )}
      </Content>
    </Box>
  );
};

export const Widget = styled(_Widget)`
  display: block;
  margin-bottom: 40px;
`;
