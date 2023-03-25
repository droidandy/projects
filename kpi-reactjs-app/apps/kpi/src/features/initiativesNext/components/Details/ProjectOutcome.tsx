import { getInitiativesState } from '../../interface';
import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { useTranslation } from 'react-i18next';
import { styled } from 'src/styled';

const List = styled.ul`
  margin: 0;
  margin-left: 15px;
  padding: 0;
`;

export function ProjectOutcome() {
  const initiativesState = getInitiativesState.useState();
  const initiative = initiativesState.initiative!;
  const { t } = useTranslation();

  return (
    <Portlet maxHeight padding title={t('Project Outcome')}>
      <List>
        {initiative.projectOutcomes.map(item => (
          <li key={item.id}>{item.value}</li>
        ))}
      </List>
    </Portlet>
  );
}
