import { IoC } from '@invest.wl/core';
import { IDOperationDepositCreateCaseProps } from '@invest.wl/domain/src/Operation/case/D.OperationDepositCreate.case';

import { mapScreenPropsToProps, VContainer, VContent, VNavBar, VStatusBar, VStub } from '@invest.wl/mobile';
import { VOperationDepositCreatePresent, VOperationDepositCreatePresentTid } from '@invest.wl/view/src/Operation/present/V.OperationDepositCreate.present';
import { VOperationDepositForm } from '_view/Operation/component/V.OperationDepositForm.component';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVOperationDepositScreenProps extends IDOperationDepositCreateCaseProps {
}

@mapScreenPropsToProps
@observer
export class VOperationDepositCreateScreen extends React.Component<IVOperationDepositScreenProps> {
  private _pr = IoC.get<VOperationDepositCreatePresent>(VOperationDepositCreatePresentTid);

  public componentDidMount() {
    this._pr.init(this.props);
  }

  public render() {
    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={'Пополнить счет'} />
        </VNavBar>
        <VContent pa={20}>
          <VStub mapXList={[this._pr.agreementListX]}>{() => {
            const { createModel, currencyList, agreementListX, create } = this._pr;
            return (
              <VOperationDepositForm model={createModel} agreementList={agreementListX.list}
                currencyList={currencyList} onCancel={this._cancel} onSubmit={create} />
            );
          }}</VStub>
        </VContent>
      </VContainer>
    );
  }

  private _cancel = () => this._pr.router.back();
}
