import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { getRouterState } from 'typeless-router';
import { KpiReportView } from './components/KpiReportView';
import {
  KpiReportActions,
  UnitReportState,
  handle,
  getKpiReportState,
} from './interface';
import {
  updateKpiReportDataSeries,
  validateKpiReport,
  submitKpiReport,
  rejectKpiReport,
  approveKpiReport,
  getKpiReport,
  getUnitReport,
} from 'src/services/API-next';
import { catchErrorAndShowModal } from 'src/common/utils';
import { ReportCommentsActions } from '../unitReport/components/ReportCommentsModal';
import { SkipConfirmActions } from '../unitReport/components/SkipConfirmModal';
import { GlobalActions } from '../global/interface';
import { UnreachableCaseError } from 'src/common/helper';
import { KpiReportComment, KpiEvidence, TransString } from 'src/types-next';
import { AddUnitCommentActions } from '../unitReport/components/AddUnitComment';
import { uploadEvidence } from '../unitReport/common';

function submit(skip: boolean) {
  const { unitReport } = getKpiReportState();
  return submitKpiReport(unitReport.id, {
    skipEvidences: skip,
    skipItems: skip,
  }).pipe(
    Rx.mergeMap(() => {
      return [
        KpiReportActions.setSubmitted(),
        GlobalActions.showNotification('success', 'Submitted successfully'),
      ];
    })
  );
}

function processReview(type: 'approve' | 'reject') {
  const { unitReport } = getKpiReportState();
  return Rx.defer(() => {
    if (type === 'approve') {
      return approveKpiReport(unitReport.id);
    } else {
      return rejectKpiReport(unitReport.id);
    }
  }).pipe(
    Rx.mergeMap(() => {
      return [
        KpiReportActions.setSubmitted(),
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
  .on(KpiReportActions.$mounted, () => {
    const id = Number(R.last(getRouterState().location!.pathname.split('/')));
    return Rx.forkJoin([getUnitReport(id), getKpiReport(id)]).pipe(
      Rx.map(([unitReport, kpiReport]) =>
        KpiReportActions.loaded(unitReport, kpiReport)
      ),
      catchErrorAndShowModal()
    );
  })
  .on(KpiReportActions.updateValue, ({ kpiDataSeriesId, value }) => {
    const { kpiReport, unitReport } = getKpiReportState();
    const dataSeries = kpiReport.reportItems.find(
      item => item.kpiDataSeriesId === kpiDataSeriesId
    )!;
    dataSeries.kpiDataSeries.value = value;
    return updateKpiReportDataSeries(unitReport.id, dataSeries.id, value).pipe(
      Rx.map(ret => KpiReportActions.performanceUpdated(dataSeries.id, ret)),
      catchErrorAndShowModal()
    );
  })
  .on(KpiReportActions.save, ({ saveType }) => {
    const { unitReport, kpiReport } = getKpiReportState();
    return Rx.concatObs(
      Rx.of(KpiReportActions.setSaving(true)),
      Rx.defer(() => {
        switch (saveType) {
          case 'approve':
          case 'reject':
            return processReview(saveType);
          case 'submit':
            return validateKpiReport(unitReport.id).pipe(
              Rx.mergeMap(result => {
                if (!result.isValid) {
                  const nameMap = kpiReport.reportItems.reduce((ret, item) => {
                    ret[item.id] = item.kpiDataSeries.kpi!.name;
                    return ret;
                  }, {} as { [x: number]: TransString });
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
      Rx.of(KpiReportActions.setSaving(false))
    );
  })
  .on(SkipConfirmActions.skip, () => {
    return Rx.concatObs(
      Rx.of(KpiReportActions.setSaving(true)),
      submit(true),
      Rx.of(KpiReportActions.setSaving(false))
    );
  })
  .on(KpiReportActions.uploadFile, ({ id, file }) => {
    const { unitReport } = getKpiReportState();
    return uploadEvidence<KpiEvidence>({
      id,
      file,
      unitReport,
    }).pipe(
      Rx.map(evidence => KpiReportActions.evidenceCreated(evidence)),
      catchErrorAndShowModal()
    );
  });

// --- Reducer ---
const initialState: UnitReportState = {
  isLoaded: false,
  isSaving: false,
  kpiReport: null!,
  unitReport: null!,
  saveType: null,
  isSubmitted: false,
};

handle
  .reducer(initialState)
  .replace(KpiReportActions.$init, () => initialState)
  .on(KpiReportActions.loaded, (state, { kpiReport, unitReport }) => {
    state.kpiReport = kpiReport;
    state.unitReport = unitReport;
    state.isLoaded = true;
  })
  .on(KpiReportActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(KpiReportActions.setSubmitted, state => {
    state.isSubmitted = true;
  })
  .on(KpiReportActions.performanceUpdated, (state, { id, performance }) => {
    const dataSeries = state.kpiReport.reportItems.find(
      item => item.id === id
    )!;
    dataSeries.performances = performance;
  })
  .on(ReportCommentsActions.commentCreated, (state, { comment }) => {
    const kpiComment = comment as KpiReportComment;
    const dataSeries = state.kpiReport.reportItems.find(
      item => item.id === kpiComment.kpiSeriesReportItemId
    )!;
    dataSeries.comments.push(kpiComment);
  })
  .on(AddUnitCommentActions.commentCreated, (state, { comment }) => {
    state.unitReport.comments.push(comment);
  })
  .on(KpiReportActions.save, (state, { saveType }) => {
    state.saveType = saveType;
  })
  .on(KpiReportActions.evidenceCreated, (state, { evidence }) => {
    state.kpiReport.reportItems.forEach(item => {
      if (item.kpiDataSeries.kpiId === evidence.kpiId) {
        item.kpiDataSeries.kpi!.evidences.push(evidence);
      }
    });
  });

// --- Module ---
export default () => {
  handle();
  return <KpiReportView />;
};
