import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { ISErrorService, SErrorServiceTid } from '@invest.wl/system/src/Error/S.Error.types';
import { ISFeedbackService } from '@invest.wl/system/src/Feedback/S.Feedback.types';

@Injectable()
export class SFeedbackWebService implements ISFeedbackService {
  constructor(
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
    // @Inject(STransportFeedbackTid) private _tpFeedback: ITransportFeedback,
  ) {}

  public async review(score: number, message?: string) {
    // TODO: implement
    throw this._errorService.systemHandle(new Error('Not implemented'));
    // this._tpFeedback.review()
  }

  public async bugReport(message: string) {
    // TODO: implement
    throw this._errorService.systemHandle(new Error('Not implemented'));
  }
}

