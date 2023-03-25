import { useTranslation } from 'react-i18next';
import * as R from 'remeda';
import { NoLabelItem } from 'src/components/NoLabelItem';
import React from 'react';
import { Td, Table, Th } from 'src/components/Table';
import { useActions } from 'typeless';
import { getInfoFormState, InfoFormActions } from '../info-form';
import { getInitiativesState } from '../interface';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';

export function SkillsTable() {
  const { t } = useTranslation();
  const { values } = getInfoFormState.useState();
  const { isEditing } = getInitiativesState.useState();
  const { change } = useActions(InfoFormActions);
  const skillIds = values.skills || [];
  const { skills } = getInitiativesState.useState();
  const skillMap = React.useMemo(() => R.indexBy(skills, x => x.id), [skills]);
  return (
    <NoLabelItem>
      {skillIds.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>{t('Skill')}</Th>
              <Th>{t('Type')}</Th>
              {isEditing && <Th></Th>}
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
                  {isEditing && (
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
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </NoLabelItem>
  );
}
