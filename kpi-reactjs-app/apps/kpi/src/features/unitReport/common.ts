import * as Rx from 'src/rx';
import { UnitReport, Evidence } from 'src/types-next';
import {
  uploadFile,
  createExcellenceEvidence,
  createKpiEvidence,
} from 'src/services/API-next';
import { UnreachableCaseError } from 'src/common/helper';

interface UploadEvidenceOptions {
  id: number;
  file: File;
  unitReport: UnitReport;
}

export function uploadEvidence<T extends Evidence>(
  options: UploadEvidenceOptions
) {
  const { id, file, unitReport } = options;

  return uploadFile(file).pipe(
    Rx.mergeMap(doc => {
      return Rx.defer(() => {
        const params = {
          period: {
            year: unitReport.reportingCycle.year,
            frequency: unitReport.reportingCycle.periodFrequency,
            number: unitReport.reportingCycle.periodNumber,
          },
          attachements: [doc.id],
        };
        switch (unitReport.type) {
          case 'Excellence': {
            return createExcellenceEvidence(id, params);
          }
          case 'KPISeries': {
            return createKpiEvidence(id, params);
          }
          default:
            throw new UnreachableCaseError(unitReport.type);
        }
      }).pipe(
        Rx.mergeMap(([evidence]) => {
          if (!evidence) {
            return Rx.empty();
          }
          evidence.document = doc;
          return Rx.of((evidence as any) as T);
        })
      );
    })
  );
}
