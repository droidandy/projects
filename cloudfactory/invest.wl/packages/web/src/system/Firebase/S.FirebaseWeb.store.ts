import { ISFirebaseStore } from '@invest.wl/system/src/Firebase/S.Firebase.types';
import { Injectable } from '@invest.wl/core/src/di/IoC';
// import firebase from 'firebase/app';
import 'firebase/analytics';

@Injectable()
export class SFirebaseWebStore implements ISFirebaseStore {
  constructor(
    // @Inject(SErrorStoreTid) private _error: ISErrorStore,
  ) {}

  public init() {
    // TODO:
    // firebase.setCrashlyticsCollectionEnabled(!__DEV__);
    // this._error.exceptionX.subscribe((exception) => {
    //   if (exception) crashlytics().recordError(exception, exception.name);
    // });
  }
}
