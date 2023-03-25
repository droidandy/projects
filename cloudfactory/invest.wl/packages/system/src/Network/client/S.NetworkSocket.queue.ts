import { Injectable, IPromiseCb } from '@invest.wl/core';

export interface ISNetworkSocketQueueItem {
  callbacks: IPromiseCb;
  timeToKill: number; // Время после которого запрос считается 'протухшим'
}

export interface ISNetworkSocketQueueMap {
  [reqId: string]: ISNetworkSocketQueueItem;
}

export interface ISNetworkSocketQueueProps {
  ttl: number;
}

export interface ISNetworkSocketQueue {
  readonly map: ISNetworkSocketQueueMap;
  init(props: ISNetworkSocketQueueProps): void;
  add(reqId: string, cb: IPromiseCb): void;
  clear(reason?: string): void;
}

@Injectable()
export class SNetworkSocketQueue implements ISNetworkSocketQueue {
  public readonly map: ISNetworkSocketQueueMap = {}; // Общаяя очередь запросов
  private _props: ISNetworkSocketQueueProps = {
    ttl: 10000,
  };

  constructor() {
    // Очистка общей очереди от 'протухших запросов'
    setInterval(() => {
      const now = Date.now();
      Object.keys(this.map).map((reqId) => {
        const item = this.map[reqId];
        if (now > item.timeToKill) {
          try {
            item.callbacks.reject('Socket request timeout');
            delete this.map[reqId];
          } catch (e: any) {
            /* log to console & eat all */
            console.log(e);
          }
        }
      });
    }, 1000);
  }

  public init(props: ISNetworkSocketQueueProps) {
    this._props = props;
  }

  public add(reqId: string, cb: IPromiseCb) {
    this.map[reqId] = {
      callbacks: cb, timeToKill: Date.now() + this._props.ttl,
    };
  }

  public clear(reason?: string) {
    Object.keys(this.map).map(reqId => {
      try {
        const item = this.map[reqId];
        item.callbacks.reject(reason);
        delete this.map[reqId];
      } catch (e: any) {
        /* log to console & eat all */
        console.log(e);
      }
    });
  };
}
