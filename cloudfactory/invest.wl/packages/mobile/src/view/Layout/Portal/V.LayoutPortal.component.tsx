import { VLayoutPortalModel } from '@invest.wl/view/src/Layout/Portal/V.LayoutPortal.model';
import { IVLayoutPortalHostProps, IVLayoutPortalSiteProps } from '@invest.wl/view/src/Layout/Portal/V.LayoutPortal.types';
import * as React from 'react';
import { VLayoutPortalHost } from './V.LayoutPortalHost.component';
import { VLayoutPortalSite } from './V.LayoutPortalSite.component';

/**
 * Создать связанную между собой пару Portal.Host/Portal.Site.
 * Количество кортплов зависит от логики приложения.
 * @example
 * const NotificationPortal = new VLayoutPortal();
 * const ModalPortal = new VLayoutPortal();
 *
 * Portal.Host - добавляется один раз в приложении, отобразит содержимое всех связанных Site.
 * Portal.Site - добавляются сколько нужно раз где угодно в приложении.
 */

export class VLayoutPortal {
  private _model = new VLayoutPortalModel();

  public Host = (props: Omit<IVLayoutPortalHostProps, 'portal'>) => <VLayoutPortalHost portal={this._model} {...props} />;

  public Site = (props: Omit<IVLayoutPortalSiteProps, 'portal'>) => <VLayoutPortalSite portal={this._model} {...props} />;
}
