import React from 'react';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VInstrumentList } from '../../component';
import { VInstrumentQuoteListPresent } from '@invest.wl/view/src/Instrument/present/V.InstrumentQuoteList.present';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { computed, makeObservable } from 'mobx';
import { ViewStyle } from 'react-native';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VCol, VList, VStub } from '@invest.wl/mobile/src/view/kit';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import {
  EVInstrumentScreen, IVInstrumentQuoteListPresentProps, VInstrumentQuoteListPresentTid,
} from '@invest.wl/view/src/Instrument/V.Instrument.types';
import { IVInstrumentQuoteModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentQuote.model';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';

export interface IVInstrumentQuoteListTabProps extends IVInstrumentQuoteListPresentProps, IVLayoutScreenProps {

}

@mapScreenPropsToProps
@observer
export class VInstrumentQuoteListTab extends React.Component<IVInstrumentQuoteListTabProps> {
  private pr = IoC.get<VInstrumentQuoteListPresent>(VInstrumentQuoteListPresentTid);
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);

  constructor(props: IVInstrumentQuoteListTabProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this.pr.init(this.props);
  }

  public componentWillUnmount() {
    this.pr.dispose();
  }

  @computed
  private get style(): ViewStyle {
    return { backgroundColor: this.theme.color.bgContent };
  }

  public render() {
    const { quoteListX, sortX } = this.pr;
    return (
      <>
        <VStub mapXList={[quoteListX]} inFocus={this.props.inFocus}>
          {() => <VInstrumentList style={this.style} listX={quoteListX} onPress={this._instrumentNav} />}
        </VStub>
        <VCol flex />
        <VList.Sort model={sortX} />
      </>
    );
  }

  public _instrumentNav = (model: IVInstrumentQuoteModel) =>
    this._router.navigateTo(EVInstrumentScreen.Instrument, { cid: model.identity.dto.id });
}
