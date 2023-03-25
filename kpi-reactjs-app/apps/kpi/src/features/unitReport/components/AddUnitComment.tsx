import React from 'react';
import * as Rx from 'src/rx';
import { AddUnitCommentFormSymbol, AddUnitCommentSymbol } from '../symbol';
import { validateString } from 'src/common/helper';
import { createForm } from 'typeless-form';
import { Button } from 'src/components/Button';
import { useTranslation } from 'react-i18next';
import { createModule, useActions } from 'typeless';
import styled from 'styled-components';
import { FormInput } from 'src/components/ReduxInput';
import { UnitReportComment } from 'src/types-next';
import { catchErrorAndShowModal } from 'src/common/utils';
import { getGlobalState } from 'src/features/global/interface';
import { createUnitReportComment } from 'src/services/API-next';

const Wrapper = styled.form`
  margin-top: 20px;
  ${Button} {
    margin-top: 15px;
  }
`;

export interface AddUnitCommentProps {
  reportId: number;
}

export function AddUnitComment(props: AddUnitCommentProps) {
  useAddUnitCommentForm();
  handle();
  const { t } = useTranslation();
  const { isAddingComment } = getAddUnitCommentState.useState();
  const { submit } = useActions(AddUnitCommentFormActions);
  const { load } = useActions(AddUnitCommentActions);

  React.useEffect(() => {
    load(props.reportId);
  }, []);

  return (
    <AddUnitCommentFormProvider>
      <Wrapper
        onSubmit={e => {
          e.preventDefault();
          submit();
        }}
      >
        <FormInput name="comment" multiline placeholder={t('text...')} />
        <Button loading={isAddingComment}>{t('Add Comment')}</Button>
      </Wrapper>
    </AddUnitCommentFormProvider>
  );
}

export interface AddUnitCommentFormValues {
  comment: string;
}

export const [
  useAddUnitCommentForm,
  AddUnitCommentFormActions,
  getAddUnitCommentFormState,
  AddUnitCommentFormProvider,
] = createForm<AddUnitCommentFormValues>({
  symbol: AddUnitCommentFormSymbol,
  validator: (errors, values) => {
    validateString(errors, values, 'comment');
  },
});

export const [
  handle,
  AddUnitCommentActions,
  getAddUnitCommentState,
] = createModule(AddUnitCommentSymbol)
  .withActions({
    $init: null,
    load: (reportId: number) => ({
      payload: { reportId },
    }),
    setAddingComment: (isAddingComment: boolean) => ({
      payload: { isAddingComment },
    }),
    commentCreated: (comment: UnitReportComment) => ({ payload: { comment } }),
  })
  .withState<AddUnitCommentState>();

export interface AddUnitCommentState {
  isAddingComment: boolean;
  reportId: number;
}

handle.epic().on(AddUnitCommentFormActions.setSubmitSucceeded, () => {
  const { comment } = getAddUnitCommentFormState().values;
  const { reportId } = getAddUnitCommentState();
  return Rx.concatObs(
    Rx.of(AddUnitCommentActions.setAddingComment(true)),
    createUnitReportComment(reportId, {
      text: comment,
      addedByUserId: getGlobalState().user!.id,
      addedDate: new Date().toISOString(),
    }).pipe(
      Rx.mergeMap(ret => [
        AddUnitCommentActions.commentCreated(ret),
        AddUnitCommentFormActions.reset(),
      ]),
      catchErrorAndShowModal()
    ),
    Rx.of(AddUnitCommentActions.setAddingComment(false))
  );
});

const initialState: AddUnitCommentState = {
  isAddingComment: false,
  reportId: 0,
};

handle
  .reducer(initialState)
  .replace(AddUnitCommentActions.$init, () => initialState)
  .on(AddUnitCommentActions.load, (state, { reportId }) => {
    state.reportId = reportId;
  })
  .on(AddUnitCommentActions.setAddingComment, (state, { isAddingComment }) => {
    state.isAddingComment = isAddingComment;
  });
