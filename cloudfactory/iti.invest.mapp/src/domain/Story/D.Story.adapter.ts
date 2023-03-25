import { IDStoryAdapter } from '@invest.wl/domain/src/Story/D.Story.types';
import {
  IDStoryInfoRequestDTO, IDStoryInfoResponseDTO, IDStoryListRequestDTO, IDStoryListResponseDTO,
} from '@invest.wl/core/src/dto/Story';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import {
  STransportReportService, STransportReportServiceTid,
} from '@invest.wl/system/src/Transport/Report/S.TransportReport.service';
import { IApiResponse } from '@invest.wl/core/src/types/base.types';

@Injectable()
export class DStoryAdapter implements IDStoryAdapter {
  constructor(
    @Inject(STransportReportServiceTid) private reportTp: STransportReportService,
  ) {}

  public list(req: IDStoryListRequestDTO): Promise<IApiResponse<IDStoryListResponseDTO>> {
    return this.reportTp.StoryList(req)
      .then(res => ({
        code: 0, data: res.map(i => ({
          ...i, id: i.StoryId.toString(), Steps: i.Steps.map(s => ({ ...s, id: s.StoryStepId.toString() })),
        })),
      }));
  }

  public info(req: IDStoryInfoRequestDTO): Promise<IApiResponse<IDStoryInfoResponseDTO>> {
    return this.reportTp.StoryList({ StoryId: req.id })
      .then(res => {
        const i = res[0];
        return {
          code: 0, data: ({
            ...i, id: i.StoryId.toString(),
            Steps: i.Steps.map(s => ({ ...s, id: s.StoryStepId.toString() })),
          }),
        };
      });
  }
}
