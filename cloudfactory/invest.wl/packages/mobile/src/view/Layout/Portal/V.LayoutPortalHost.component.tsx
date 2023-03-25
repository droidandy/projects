import { LambdaX } from '@invest.wl/common';
import { IVLayoutPortalHostProps } from '@invest.wl/view/src/Layout/Portal/V.LayoutPortal.types';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

// Не используется напрямую, только через createPortal
@observer
export class VLayoutPortalHost extends React.Component<IVLayoutPortalHostProps> {
  public render() {
    const content = this._content;
    return LambdaX.resolve(this.props.children ?? this._childrenDefault, { content });
  }

  @computed
  private get _content() {
    return this.props.portal.siteList.map(site => LambdaX.resolve(site.props.children, site.context));
  }

  private _childrenDefault: IVLayoutPortalHostProps['children'] = ctx => ctx?.content;
}
