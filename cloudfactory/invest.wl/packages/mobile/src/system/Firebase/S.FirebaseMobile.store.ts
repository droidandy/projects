import { Inject, Injectable } from '@invest.wl/core';
import { ISErrorStore, ISFirebaseStore, SErrorStoreTid } from '@invest.wl/system';
import crashlytics from '@react-native-firebase/crashlytics';

@Injectable()
export class SFirebaseMobileStore implements ISFirebaseStore {
  constructor(
    @Inject(SErrorStoreTid) private _error: ISErrorStore,
  ) {}

  public init() {
    crashlytics().setCrashlyticsCollectionEnabled(!__DEV__);
    this._error.exceptionX.subscribe((exception) => {
      if (exception) crashlytics().recordError(exception, exception.name);
    });
  }
}
