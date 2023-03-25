import { useTranslation } from 'react-i18next';
import * as R from 'remeda';
import React from 'react';
import { Td, Table, Th } from 'src/components/Table';
import { useActions } from 'typeless';
import { getInitiativesState } from '../interface';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';
import styled from 'styled-components';
import { ActivityFormActions, getActivityFormState } from '../activity-form';

const Wrapper = styled.div`
  margin-top: 15px;
`;

export function SkillsTable() {
  const { t } = useTranslation();
  const { values } = getActivityFormState.useState();
  const { change } = useActions(ActivityFormActions);
  const skillIds = values.skills || [];
  const { skills } = getInitiativesState.useState();
  const skillMap = React.useMemo(() => R.indexBy(skills, x => x.id), [skills]);
  return (
    <Wrapper>
      {skillIds.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>{t('Skill')}</Th>
              <Th>{t('Type')}</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {skillIds.map(id => {
              const skill = skillMap[id];
              return (
                <tr key={id}>
                  <Td>
                    <DisplayTransString value={skill.title} />
                  </Td>
                  <Td>{t(skill.type)}</Td>
                  <Td>
                    <ConfirmDeleteLink
                      onYes={() => {
                        change(
                          'skills',
                          skillIds.filter(x => x !== id)
                        );
                      }}
                    />
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Wrapper>
  );
}
