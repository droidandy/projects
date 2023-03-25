import { ILambda } from '@invest.wl/common';
import * as React from 'react';

export interface IVLayoutPortalSiteProps {
  readonly portal: IVLayoutPortalModel;
  children?: ILambda<React.ReactNode, IVLayoutPortalSiteContext>;
}

export interface IVLayoutPortalHostProps {
  readonly portal: IVLayoutPortalModel;
  children?: ILambda<React.ReactNode, IVLayoutPortalHostContext>;
}

export interface IVLayoutPortalHostContext {
  readonly content: React.ReactNode;
}

export interface IVLayoutPortalSiteContext {
  // Порядок сайта портала от самого нового к старому.
  // Таким образом при добавлении/удалении сайта order каждого добавленного сайта обновляется,
  // что позволяет применить к ним транформацию согластно порядку расположения.
  readonly order: number;
  // Порядковый индекс Site.
  readonly index: number;
  // Общее количество Site в этом Portal.
  readonly count: number;
}

export interface IVLayoutPortalModel {
  siteList: IVLayoutPortalSiteModel[];
  siteAdd(site: IVLayoutPortalSiteModel): void;
  siteRemove(site: IVLayoutPortalSiteModel): void;
}

export interface IVLayoutPortalSiteModel {
  readonly props: IVLayoutPortalSiteProps;
  readonly context: IVLayoutPortalSiteContext | undefined;
  contextSet(ctx?: ILambda<IVLayoutPortalSiteContext | undefined>): void;
}
