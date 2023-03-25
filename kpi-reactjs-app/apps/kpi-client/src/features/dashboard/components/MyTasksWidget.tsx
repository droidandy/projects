import { useTranslation } from 'react-i18next';
import React from 'react';
import styled from 'styled-components';
import { Box } from 'src/components/Box';
import { NoTasksImage } from 'src/components/NoTasksImage';
import { EmptyWidgetContent } from 'src/components/EmptyWidgetContent';

const Top = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h5`
  line-height: 34px;
`;

const Content = styled.div`
  min-height: 450px;
  height: 100%;
`;

export function MyTasksWidget() {
  const { t } = useTranslation();

  return (
    <Box>
      <Top>
        <Title>{t('My Tasks')}</Title>
      </Top>
      <Content>
        <EmptyWidgetContent title={t('No Tasks Available Right Now')}>
          <NoTasksImage />
        </EmptyWidgetContent>
      </Content>
    </Box>
  );
}
