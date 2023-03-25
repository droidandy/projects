import { getInitiativesState } from '../../interface';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Portlet } from 'src/components/Portlet';
import styled from 'styled-components';

const Entry = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export function SideInfo() {
  const initiativesState = getInitiativesState.useState();
  const initiative = initiativesState.initiative!;
  const { t } = useTranslation();

  return (
    <Portlet padding maxHeight>
      <Entry>
        <span>{t('Code')}</span>
        <span>{initiative.projectCode}</span>
      </Entry>
      <Entry>
        <span>{t('FTE')}</span>
        <span>{initiative.fullTimeEquivalent}</span>
      </Entry>
      <Entry>
        <span>{t('Type')}</span>
        <span>{initiative.initiativeType}</span>
      </Entry>
      <Entry>
        <span>{t('Level')}</span>
        <span>{initiative.initiativeLevel}</span>
      </Entry>
      <Entry>
        <span>{t('Contract')} #</span>
        <span>{initiative.contractNumber}</span>
      </Entry>
    </Portlet>
  );
}
