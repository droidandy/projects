import { Observable, Subject } from 'rxjs';
import { whenObserved } from './whenObserved.helper';

export function whenObservedStream<T extends Record<string, any>, R>(obj: T, propeprty: keyof T): Observable<boolean> {
  const subject = new Subject<boolean>();
  whenObserved(obj, propeprty, async () => {
    subject.next(true);
  }, async () => {
    subject.next(false);
  });

  return subject;
}

export { whenObserved };
