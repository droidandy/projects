import { ILambda, LambdaX } from '@invest.wl/common';
import { action, computed, makeObservable, observable } from 'mobx';
import { IVLayoutPortalModel, IVLayoutPortalSiteContext, IVLayoutPortalSiteModel, IVLayoutPortalSiteProps } from './V.LayoutPortal.types';

export class VLayoutPortalModel implements IVLayoutPortalModel {
  @observable.shallow public readonly siteList: IVLayoutPortalSiteModel[] = [];

  constructor() {
    makeObservable(this);
  }

  @action
  public siteAdd(site: IVLayoutPortalSiteModel) {
    if (this.siteList.includes(site)) {
      throw new Error('Site already added to this Portal');
    }
    this.siteList.push(site);
    site.contextSet(() => {
      const index = this.siteList.indexOf(site);
      const count = this.siteList.length;
      const order = count - 1 - this.siteList.indexOf(site);
      return { order, index, count };
    });
  }

  @action
  public siteRemove(site: IVLayoutPortalSiteModel) {
    const index = this.siteList.indexOf(site);
    if (index !== -1) {
      this.siteList.splice(index, 1);
      site.contextSet();
    }
  }
}

export class VLayoutPortalSiteModel implements IVLayoutPortalSiteModel {
  private readonly _props: LambdaX<IVLayoutPortalSiteProps>;
  private readonly _context = new LambdaX<IVLayoutPortalSiteContext | undefined>(undefined);

  constructor(props: ILambda<IVLayoutPortalSiteProps>) {
    this._props = new LambdaX(props);
    makeObservable(this);
  }

  @computed
  public get props() {
    return this._props.value;
  }

  @computed
  public get context() {
    return this._context.value;
  }

  public contextSet(ctx?: ILambda<IVLayoutPortalSiteContext | undefined>) {
    return this._context.setValue(ctx);
  }
}
