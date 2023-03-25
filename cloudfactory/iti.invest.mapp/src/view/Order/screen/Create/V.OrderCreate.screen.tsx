import React from 'react';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { IDOrderCreateCaseProps } from '@invest.wl/domain/src/Order/case/D.OrderCreate.case';
import { VContainer, VContent, VNavBar, VStatusBar, VStub } from '@invest.wl/mobile/src/view/kit';
import { VOrderCreateForm } from '../../component';
import { VOrderCreatePresent, VOrderCreatePresentTid } from '@invest.wl/view/src/Order/present/V.OrderCreate.present';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { VOrderCreateConfirm } from '../../component/V.OrderCreateConfirm.component';
import { IVTradeI18n, VTradeI18nTid } from '@invest.wl/view/src/Trade/V.Trade.types';
import { EVLayoutScreen } from '@invest.wl/view/src/Layout/V.Layout.types';
import { EVOrderScreen } from '@invest.wl/view/src/Order/V.Order.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';

export interface IVOrderCreateScreenProps extends IDOrderCreateCaseProps {
}

@mapScreenPropsToProps
@observer
export class VOrderCreateScreen extends React.Component<IVOrderCreateScreenProps> {
  private _pr = IoC.get<VOrderCreatePresent>(VOrderCreatePresentTid);
  private _tradeI18n = IoC.get<IVTradeI18n>(VTradeI18nTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);

  public componentDidMount() {
    this._pr.init(this.props);
  }

  public render() {
    const { accountListX, instrumentX } = this._pr;

    return (
      <VContainer>
        <VStatusBar translucent />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={this._tradeI18n.direction[this.props.direction]} />
        </VNavBar>
        <VContent pa={20}>
          <VStub mapXList={[accountListX, instrumentX]}>
            {() => {
              const {
                createModel, infoX, timerModel,
                confirmModel, create, cancel, isCreated, createCase: { isConfirming },
              } = this._pr;
              if (!isCreated) {
                return (
                  <VOrderCreateForm model={createModel} instrumentModel={instrumentX.model!}
                    accountModelList={accountListX.list} onCreate={create} />
                );
              }
              return (
                <VOrderCreateConfirm model={confirmModel} instrumentModel={instrumentX.model!}
                  createModel={createModel} orderModel={infoX.model} timerModel={timerModel}
                  onConfirm={this._confirm} onCancel={cancel} isConfirming={isConfirming} />
              );
            }}
          </VStub>
        </VContent>
      </VContainer>
    );
  }

  private _confirm = async () => {
    try {
      await this._pr.confirm();
      this._router.replaceTo(EVLayoutScreen.LayoutOperationTabs, { screen: EVOrderScreen.OrderList });
    } catch (e: any) {
      this._router.back();
      throw e;
    }
  };
}
