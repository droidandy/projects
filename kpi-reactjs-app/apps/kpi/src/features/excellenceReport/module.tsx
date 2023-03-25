import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { getRouterState } from 'typeless-router';
import { ExcellenceReportView } from './components/ExcellenceReportView';
import {
  ExcellenceReportActions,
  ExcellenceReportState,
  getExcellenceReportState,
  handle,
} from './interface';
import {
  getUnitReport,
  getExcellenceReport,
  submitExcellenceReport,
  updateExcellenceRequirement,
  rejectExcellenceReport,
  approveExcellenceReport,
  validateExcellenceReport,
} from 'src/services/API-next';
import { catchErrorAndShowModal } from 'src/common/utils';
import { GlobalActions } from '../global/interface';
import { UnreachableCaseError } from 'src/common/helper';
import { ReportCommentsActions } from '../unitReport/components/ReportCommentsModal';
import {
  ExcellenceReportItemComment,
  ExcellenceEvidence,
  TransString,
} from 'src/types-next';
import { AddUnitCommentActions } from '../unitReport/components/AddUnitComment';
import { uploadEvidence } from '../unitReport/common';
import { SkipConfirmActions } from '../unitReport/components/SkipConfirmModal';

function submit(skip: boolean) {
  const { unitReport } = getExcellenceReportState();
  return submitExcellenceReport(unitReport.id, {
    skipEvidences: skip,
    skipItems: skip,
  }).pipe(
    Rx.mergeMap(() => {
      return [
        ExcellenceReportActions.setSubmitted(),
        GlobalActions.showNotification('success', 'Submitted successfully'),
      ];
    })
  );
}

function processReview(type: 'approve' | 'reject') {
  const { unitReport } = getExcellenceReportState();
  return Rx.defer(() => {
    if (type === 'approve') {
      return approveExcellenceReport(unitReport.id);
    } else {
      return rejectExcellenceReport(unitReport.id);
    }
  }).pipe(
    Rx.mergeMap(() => {
      return [
        ExcellenceReportActions.setSubmitted(),
        GlobalActions.showNotification(
          'success',
          type === 'approve' ? 'Approved successfully' : 'Rejected successfully'
        ),
      ];
    })
  );
}

// --- Epic ---
handle
  .epic()
  .on(ExcellenceReportActions.$mounted, () => {
    const id = Number(R.last(getRouterState().location!.pathname.split('/')));
    return Rx.forkJoin([getUnitReport(id), getExcellenceReport(id)]).pipe(
      Rx.map(([unitReport, kpiReport]) =>
        ExcellenceReportActions.loaded(unitReport, kpiReport)
      ),
      catchErrorAndShowModal()
    );
  })
  .on(ExcellenceReportActions.save, ({ saveType }) => {
    const { unitReport, excellenceReport } = getExcellenceReportState();
    return Rx.concatObs(
      Rx.of(ExcellenceReportActions.setSaving(true)),
      Rx.defer(() => {
        switch (saveType) {
          case 'approve':
          case 'reject':
            return processReview(saveType);
          case 'submit':
            return validateExcellenceReport(unitReport.id).pipe(
              Rx.mergeMap(result => {
                if (!result.isValid) {
                  const nameMap = excellenceReport.reportItems.reduce(
                    (ret, item) => {
                      ret[item.id] = item.excellenceRequirement.name;
                      return ret;
                    },
                    {} as { [x: number]: TransString }
                  );
                  return Rx.of(
                    SkipConfirmActions.show(result.validation, nameMap)
                  );
                } else {
                  return submit(false);
                }
              })
            );

          default:
            throw new UnreachableCaseError(saveType);
        }
      }).pipe(catchErrorAndShowModal()),
      Rx.of(ExcellenceReportActions.setSaving(false))
    );
  })
  .on(ExcellenceReportActions.updateExcellenceItem, ({ id }) => {
    const item = getExcellenceReportState().excellenceReport.reportItems.find(
      x => x.id === id
    )!.excellenceRequirement;
    return updateExcellenceRequirement(
      item.id,
      R.omit(item, ['excellenceTheme', 'excellenceCriteria', 'statusColor'])
    ).pipe(Rx.ignoreElements(), catchErrorAndShowModal());
  })
  .on(ExcellenceReportActions.uploadFile, ({ id, file }) => {
    const { unitReport } = getExcellenceReportState();
    return uploadEvidence<ExcellenceEvidence>({
      id,
      file,
      unitReport,
    }).pipe(
      Rx.map(evidence => ExcellenceReportActions.evidenceCreated(evidence)),
      catchErrorAndShowModal()
    );
  })
  .on(SkipConfirmActions.skip, () => {
    return Rx.concatObs(
      Rx.of(ExcellenceReportActions.setSaving(true)),
      submit(true),
      Rx.of(ExcellenceReportActions.setSaving(false))
    );
  });

// --- Reducer ---
const initialState: ExcellenceReportState = {
  isLoaded: false,
  isSaving: false,
  excellenceReport: null!,
  unitReport: null!,
  saveType: null,
  isSubmitted: false,
};

handle
  .reducer(initialState)
  .replace(ExcellenceReportActions.$init, () => initialState)
  .on(
    ExcellenceReportActions.loaded,
    (state, { excellenceReport, unitReport }) => {
      state.excellenceReport = excellenceReport;
      state.unitReport = unitReport;
      state.isLoaded = true;
    }
  )
  .on(ExcellenceReportActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(ExcellenceReportActions.setSubmitted, state => {
    state.isSubmitted = true;
  })
  .on(ReportCommentsActions.commentCreated, (state, { comment }) => {
    const excellenceComment = comment as ExcellenceReportItemComment;
    const item = state.excellenceReport.reportItems.find(
      x => x.id === excellenceComment.excellenceReportItemId
    )!;
    item.comments.push(excellenceComment);
  })
  .on(AddUnitCommentActions.commentCreated, (state, { comment }) => {
    state.unitReport.comments.push(comment);
  })
  .on(ExcellenceReportActions.save, (state, { saveType }) => {
    state.saveType = saveType;
  })
  .on(ExcellenceReportActions.updateExcellenceItem, (state, { id, values }) => {
    const item = state.excellenceReport.reportItems.find(x => x.id === id)!
      .excellenceRequirement;
    Object.assign(item, values);
    if (item.requirementStatus === 'NotExist') {
      item.isEnabled = false;
    }
    if (!item.isEnabled) {
      item.isCompleted = false;
    }
  })
  .on(ExcellenceReportActions.evidenceCreated, (state, { evidence }) => {
    state.excellenceReport.reportItems.forEach(item => {
      if (item.excellenceRequirementId === evidence.excellenceRequirementId) {
        item.excellenceRequirement.evidences.push(evidence);
      }
    });
  });

// --- Module ---
export default () => {
  handle();
  return <ExcellenceReportView />;
};
