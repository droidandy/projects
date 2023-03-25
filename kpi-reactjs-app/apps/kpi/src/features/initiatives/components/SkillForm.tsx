import { SelectOption } from 'src/types';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { createForm } from 'typeless-form';
import { SkillFormSymbol, SkillSymbol } from '../symbol';
import { validateOption } from 'src/common/helper';
import React from 'react';
import { FormItem } from 'src/components/FormItem';
import { Col, Row } from 'src/components/Grid';
import { Button } from 'src/components/Button';
import { InfoFormActions, getInfoFormState } from '../info-form';
import { createModule, useActions } from 'typeless';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'src/components/Checkbox';
import { SkillType, Skill } from 'src/types-next';
import { getInitiativesState, InitiativesActions } from '../interface';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { CreatableFormSelect } from 'src/components/FormSelect';
import { createSkill } from 'src/services/API-next';
import { catchErrorAndShowModal } from 'src/common/utils';
import i18n from 'src/i18n';
import { useLanguage } from 'src/hooks/useLanguage';

const Checkboxes = styled.div`
  padding-top: 15px;
  height: 100%;
  display: flex;
  align-items: center;

  ${Checkbox} + ${Checkbox} {
    margin-left: 10px;
  }

  ${Button} {
    margin-left: 20px;
  }
`;

function skillToOption(skill: Skill) {
  const lang = useLanguage();

  return {
    label: <DisplayTransString value={skill.title} />,
    value: skill.id,
    filterName: skill.title[lang],
  };
}

export function SkillForm() {
  handle();
  useSkillForm();
  const { t } = useTranslation();
  const { submit, change } = useActions(SkillFormActions);
  const { addSkill } = useActions(SkillActions);
  const types: SkillType[] = ['Generic', 'Specific'];
  const [type, setType] = React.useState('Generic' as SkillType);
  const { skills } = getInitiativesState.useState();
  const { values } = getInfoFormState.useState();
  const { isCreateSkillLoading } = getSkillState.useState();
  const options = React.useMemo(() => {
    const used = R.indexBy(values.skills || [], x => x);
    return skills
      .filter(item => item.type === type && !used[item.id])
      .map(skillToOption);
  }, [skills, type, values.skills]);

  return (
    <SkillFormProvider>
      <form
        onSubmit={e => {
          e.preventDefault();
          submit();
        }}
      >
        <Row>
          <Col>
            <FormItem label="Skills" required labelTop>
              <CreatableFormSelect
                isDisabled={isCreateSkillLoading}
                isLoading={isCreateSkillLoading}
                name="selected"
                options={options}
                onCreateOption={name => addSkill(name, type)}
              />
            </FormItem>
          </Col>
          <Col>
            <Checkboxes>
              {types.map(item => (
                <Checkbox
                  noMargin
                  radio
                  key={item}
                  onChange={() => {
                    change('selected', null!);
                    setType(item);
                  }}
                  checked={type === item}
                >
                  {t(item)}
                </Checkbox>
              ))}
              <Button>{t('add')}</Button>
            </Checkboxes>
          </Col>
        </Row>
      </form>
    </SkillFormProvider>
  );
}

export interface SkillFormValues {
  selected: SelectOption;
}

export const [
  useSkillForm,
  SkillFormActions,
  getSkillFormState,
  SkillFormProvider,
] = createForm<SkillFormValues>({
  symbol: SkillFormSymbol,
  validator: (errors, values) => {
    validateOption(errors, values, 'selected');
  },
});

interface SkillState {
  isCreateSkillLoading: boolean;
}

export const [handle, SkillActions, getSkillState] = createModule(SkillSymbol)
  .withActions({
    addSkill: (name: string, type: SkillType) => ({ payload: { name, type } }),
    setIsCreateSkillLoading: (isCreateSkillLoading: boolean) => ({
      payload: {
        isCreateSkillLoading,
      },
    }),
  })
  .withState<SkillState>();

handle
  .epic()
  .on(SkillFormActions.setSubmitSucceeded, () => {
    const { values: infoFormValues } = getInfoFormState();
    const skills = infoFormValues.skills || [];
    const { values } = getSkillFormState();
    return [
      InfoFormActions.changeMany({
        skills: [...skills, values.selected.value],
      }),
      SkillFormActions.reset(),
    ];
  })
  .on(SkillActions.addSkill, ({ name, type }) => {
    return Rx.concatObs(
      Rx.of(SkillActions.setIsCreateSkillLoading(true)),
      createSkill({
        title: {
          [i18n.language]: name,
        },
        type,
      }).pipe(
        Rx.mergeMap(skill => {
          return [
            InitiativesActions.skillCreated(skill),
            SkillFormActions.change('selected', skillToOption(skill)),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(SkillActions.setIsCreateSkillLoading(false))
    );
  });

handle
  .reducer({ isCreateSkillLoading: false })
  .on(
    SkillActions.setIsCreateSkillLoading,
    (state, { isCreateSkillLoading }) => {
      state.isCreateSkillLoading = isCreateSkillLoading;
    }
  );
