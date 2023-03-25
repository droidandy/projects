import React from 'react';
import { createForm } from 'typeless-form';
import { validateString } from 'src/common/helper';
import { OutcomeFormSymbol, OutcomeSymbol } from '../symbol';
import { useActions, createModule } from 'typeless';
import { Row, Col } from 'src/components/Grid';
import { FormInput } from 'src/components/ReduxInput';
import { FormItem } from 'src/components/FormItem';
import { useTranslation } from 'react-i18next';
import { getInfoFormState, InfoFormActions, getOutcomeKey } from '../info-form';
import { Button } from 'src/components/Button';
import styled from 'styled-components';

const AddButton = styled(Button)`
  margin-top: 15px;
`;
export function OutcomeForm() {
  handle();
  useOutcomeForm();
  const { t } = useTranslation();
  const { submit } = useActions(OutcomeFormActions);
  return (
    <OutcomeFormProvider>
      <form
        onSubmit={e => {
          e.preventDefault();
          submit();
        }}
      >
        <Row>
          <Col>
            <FormItem label="Outcome" required labelTop>
              <FormInput name="value" />
            </FormItem>
          </Col>
          <Col>
            <AddButton>{t('add')}</AddButton>
          </Col>
        </Row>
      </form>
    </OutcomeFormProvider>
  );
}

export interface OutcomeFormValues {
  value: string;
}

export const [
  useOutcomeForm,
  OutcomeFormActions,
  getOutcomeFormState,
  OutcomeFormProvider,
] = createForm<OutcomeFormValues>({
  symbol: OutcomeFormSymbol,
  validator: (errors, values) => {
    validateString(errors, values, 'value');
  },
});

export const [handle] = createModule(OutcomeSymbol);

handle.epic().on(OutcomeFormActions.setSubmitSucceeded, () => {
  const { values: infoFormValues } = getInfoFormState();
  const outcomes = infoFormValues.outcomes || [];
  const { values } = getOutcomeFormState();
  const id = -Date.now();
  return [
    InfoFormActions.changeMany({
      outcomes: [...outcomes, id],
      [getOutcomeKey(id, 'value')]: values.value,
    }),
    OutcomeFormActions.reset(),
  ];
});
