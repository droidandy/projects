import { Container } from 'inversify';
import 'reflect-metadata';

export interface IIocModule {
  configure(ioc: Container): void;
  preload?(): Promise<any>;
  init?(): Promise<any>;
}

// TODO: think about hierarchical DI https://github.com/inversify/InversifyJS/blob/master/wiki/hierarchical_di.md
export class IoC {
  public static root = new Container();

  private static _firstLoaded = false;
  private static _isInited = false;
  private static _initInProgress = false;

  private static _module?: IIocModule;

  public static get<T>(token: any): T {
    return this.root.get(token);
  }

  public static moduleLoad(module: IIocModule) {
    // (!) HOT RELOADING handle
    if (this._firstLoaded) return;
    else this._firstLoaded = true;
    this._module = module;
    this._module.configure(IoC.root);
  }

  public static async init() {
    if (this._isInited || this._initInProgress || !this._module) return;
    this._initInProgress = true;
    try {
      await this._module.preload?.();
      await this._module.init?.();
      this._isInited = true;
      this._initInProgress = false;
      if (__DEV__) console.log('[IoC.init] OK');
    } catch (e: any) {
      if (__DEV__) console.error('[IoC.init] ERROR', e);
      this._initInProgress = false;
      throw e;
    }
  }
}

export abstract class IocModule implements IIocModule {
  protected list?: IIocModule[];

  public configure(ioc: Container): void {
    this.list?.forEach(m => m.configure(ioc));
  }

  public async preload(): Promise<any> {
    return this.list && Promise.all(this.list.map(m => m.preload?.()));
  }

  public async init(): Promise<any> {
    return this.list && Promise.all(this.list.map(m => m.init?.()));
  }
}

export { injectable as Injectable, inject as Inject, Container as IocContainer, optional as Optional } from 'inversify';

export type Factory<T> = (...args: any[]) => T;
export type NewableType<T, A extends any[] = any[]> = new (...arg: A) => T;
export type Newable<T extends NewableType<any>> = new (...arg: ConstructorParameters<T>) => InstanceType<T>;
