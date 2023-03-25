import { CancellableAxiosPromise } from 'api/request';

type Pendings = Map<symbol, CancellableAxiosPromise>;
const PendingsMap: Pendings = new Map();

export const Pending = <P>(key: string, request: CancellableAxiosPromise<P>): CancellableAxiosPromise<P> => {
  const pendingKey = Symbol.for('pending-' + key);

  if (PendingsMap.has(pendingKey)) {
    const p = PendingsMap.get(pendingKey);
    if (p?.cancel) {
      p.cancel();
      PendingsMap.delete(pendingKey);
    }
  }

  PendingsMap.set(pendingKey, request);
  return request;
};
