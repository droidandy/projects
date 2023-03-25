import { VLayoutPortalSiteModel } from '@invest.wl/view/src/Layout/Portal/V.LayoutPortal.model';
import { IVLayoutPortalSiteProps } from '@invest.wl/view/src/Layout/Portal/V.LayoutPortal.types';
import { observer } from 'mobx-react';
import * as React from 'react';

// Не используется напрямую, только через createPortal
@observer
export class VLayoutPortalSite extends React.Component<IVLayoutPortalSiteProps> {
  // Отслеживаем изменение children
  private _model = new VLayoutPortalSiteModel(() => this.props);

  public componentDidMount() {
    this.props.portal.siteAdd(this._model);
  }

  public componentWillUnmount() {
    this.props.portal.siteRemove(this._model);
  }

  public render() {
    return null;
  }
}
