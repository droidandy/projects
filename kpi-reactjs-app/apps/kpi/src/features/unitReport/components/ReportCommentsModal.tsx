import * as Rx from 'src/rx';
import {
  BaseComment,
  UnitReportType,
  KpiReportComment,
  ExcellenceReportItemComment,
} from 'src/types-next';
import { createModule, useActions } from 'typeless';
import { ReportCommentsSymbol, ReportCommentsFormSymbol } from '../symbol';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createForm } from 'typeless-form';
import { validateString, UnreachableCaseError } from 'src/common/helper';
import { FormInput } from 'src/components/ReduxInput';
import { SidePanel } from 'src/components/SidePanel';
import { Button } from 'src/components/Button';
import styled from 'styled-components';
import {
  createKpiReportDataSeriesComment,
  createExcellenceReportItemComment,
} from 'src/services/API-next';
import { catchErrorAndShowModal } from 'src/common/utils';
import { ReportComment } from './ReportComment';

const Wrapper = styled.form`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Bottom = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  padding: 15px 0;
  width: 100%;
  ${Button} {
    margin-top: 15px;
  }
`;

const Comments = styled.div`
  flex: 1 1 auto;
  overflow: auto;
`;

export function ReportCommentsModal() {
  handle();
  useReportCommentsForm();
  const { isVisible, isSaving, comments } = getReportCommentsState.useState();
  const { close } = useActions(ReportCommentsActions);
  const { submit } = useActions(ReportCommentsFormActions);
  const { t } = useTranslation();
  return (
    <SidePanel isOpen={isVisible} title={t('Comments')} close={close}>
      <ReportCommentsFormProvider>
        <Wrapper
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <Comments>
            {comments.map(item => (
              <ReportComment key={item.id} comment={item} />
            ))}
          </Comments>
          <Bottom>
            <FormInput name="comment" multiline placeholder={t('text...')} />
            <Button loading={isSaving}>{t('Add Comment')}</Button>
          </Bottom>
        </Wrapper>
      </ReportCommentsFormProvider>
    </SidePanel>
  );
}

export const [
  handle,
  ReportCommentsActions,
  getReportCommentsState,
] = createModule(ReportCommentsSymbol)
  .withActions({
    show: (
      type: UnitReportType,
      reportId: number,
      itemId: number,
      comments: BaseComment[]
    ) => ({ payload: { type, reportId, itemId, comments } }),
    close: null,
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    commentCreated: (
      comment: KpiReportComment | ExcellenceReportItemComment
    ) => ({
      payload: { comment },
    }),
  })
  .withState<ReportCommentsState>();

interface ReportCommentsState {
  isVisible: boolean;
  isSaving: boolean;
  comments: BaseComment[];
  reportId: number;
  type: UnitReportType;
  itemId: number;
}

const initialState: ReportCommentsState = {
  isVisible: false,
  isSaving: false,
  reportId: 0,
  itemId: 0,
  type: null!,
  comments: [],
};

export interface ReportCommentsFormValues {
  comment: string;
}

export const [
  useReportCommentsForm,
  ReportCommentsFormActions,
  getReportCommentsFormState,
  ReportCommentsFormProvider,
] = createForm<ReportCommentsFormValues>({
  symbol: ReportCommentsFormSymbol,
  validator: (errors, values) => {
    validateString(errors, values, 'comment');
  },
});

handle
  .epic()
  .on(ReportCommentsActions.show, () => ReportCommentsFormActions.reset())
  .on(ReportCommentsFormActions.setSubmitSucceeded, () => {
    const { reportId, itemId, type } = getReportCommentsState();
    const { comment } = getReportCommentsFormState().values;
    return Rx.concatObs(
      Rx.of(ReportCommentsActions.setSaving(true)),
      Rx.defer(() => {
        switch (type) {
          case 'Excellence':
            return createExcellenceReportItemComment(reportId, itemId, {
              text: comment,
            });
          case 'KPISeries':
            return createKpiReportDataSeriesComment(reportId, itemId, {
              text: comment,
            });
          default:
            throw new UnreachableCaseError(type);
        }
      }).pipe(
        Rx.mergeMap(created => [
          ReportCommentsFormActions.reset(),
          ReportCommentsActions.commentCreated(created),
        ]),
        catchErrorAndShowModal()
      ),
      Rx.of(ReportCommentsActions.setSaving(false))
    );
  });

handle
  .reducer(initialState)
  .replace(
    ReportCommentsActions.show,
    (state, { type, reportId, itemId, comments }) => ({
      ...initialState,
      isVisible: true,
      type,
      comments,
      reportId,
      itemId,
    })
  )
  .on(ReportCommentsActions.close, state => {
    state.isVisible = false;
  })
  .on(ReportCommentsActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(ReportCommentsActions.commentCreated, (state, { comment }) => {
    state.comments.push(comment);
  });
