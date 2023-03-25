import { observer } from 'mobx-react';
import * as React from 'react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VContainer, VNavBar } from '@invest.wl/mobile/src/view/kit';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { SHardwareBackHolder } from '@invest.wl/system/src/HardwareBack/S.HardwareBack.holder';
import { VWebView } from '@invest.wl/mobile/src/view/kit/Output/WebView/V.WebView.component';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { IVLayoutWebViewScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';

@mapScreenPropsToProps
@observer
export class VWebViewScreen extends React.Component<IVLayoutWebViewScreenProps> {
  private _backHandler = new SHardwareBackHolder();
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);

  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    this._backHandler.subscribe(() => this._router.back());
  }

  public componentWillUnmount() {
    this._backHandler.dispose();
  }

  public render() {
    const { title, ...webViewProps } = this.props;
    return (
      <VContainer>
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={title} />
        </VNavBar>
        <VWebView {...webViewProps} />
      </VContainer>
    );
  }
}
