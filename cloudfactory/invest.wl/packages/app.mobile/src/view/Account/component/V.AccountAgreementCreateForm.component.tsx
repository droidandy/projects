import { EDAccountMarketType, EDAccountAgreementType, TModelId } from '@invest.wl/core';
import { IVFlexProps, IVSelectData, VCheckBox, VSelect, VText } from '@invest.wl/mobile';
import { VAccountAgreementCreateModel } from '@invest.wl/view/src/Account/model/V.AccountAgreementCreate.model';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVAccountAgreementCreateFormProps extends IVFlexProps {
  model: VAccountAgreementCreateModel;
  typeList: EDAccountAgreementType[];
  tariffListSelect: IVSelectData<TModelId>;
  quikListSelect: IVSelectData<TModelId>;
}

@observer
export class VAccountAgreementCreateForm extends React.Component<IVAccountAgreementCreateFormProps> {
  private static _accountTypeI18n = {
    [EDAccountAgreementType.Default]: 'Брокерский',
    [EDAccountAgreementType.IIS]: 'Брокерский ИИС',
    [EDAccountAgreementType.PIF]: '',
    [EDAccountAgreementType.DU]: '',
  };

  private static _accountMarketTypeI18n = {
    [EDAccountMarketType.Fund]: 'Фондовый рынок (Московская биржа)',
    [EDAccountMarketType.Currency]: 'Валютный рынок (Московская биржа)',
    [EDAccountMarketType.Term]: 'Срочный рынок (Московская биржа)',
    [EDAccountMarketType.FundSPB]: 'Торги иностранными ЦБ (Санкт-Петербургская биржа)',
    [EDAccountMarketType.OTC]: 'Внеберживые торги',
  };

  @computed
  public get _typeSelectList(): IVSelectData<EDAccountAgreementType> {
    return this.props.typeList.map(t => ({ value: t, name: VAccountAgreementCreateForm._accountTypeI18n[t] }));
  }

  constructor(props: IVAccountAgreementCreateFormProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { tariffListSelect, quikListSelect, model } = this.props;
    const {
      type, tariffId, marketTypeList, IISOtherOwner, loan, singleLimit, quikTypeList,
    } = model.fields;

    return (
      <>
        <VSelect.Dropdown title={'Тип договора'} selected={type.value} onChange={type.onChange}
          placeholder={'Тип договора'} data={this._typeSelectList} />
        <VSelect.Dropdown mt={'lg'} title={'Тариф'} selected={tariffId.value} onChange={tariffId.onChange}
          placeholder={'Тариф'} data={tariffListSelect} />
        <VCheckBox mt={'lg'} isChecked={singleLimit.isChecked} onPress={singleLimit.onChange}
          text={'Оказывать брокерское обслуживание на условия единого лимита'} />

        <VText mt={'xl'} mb={'lg'} ta={'center'} font={'body7'}>Торговые системы</VText>

        {marketTypeList.map((mt, index) => (
          <VCheckBox mt={!index ? undefined : 'lg'} key={index} isChecked={mt.isChecked} onPress={mt.onChange}
            text={VAccountAgreementCreateForm._accountMarketTypeI18n[mt.domain.values[1]]} />
        ))}

        <VText mt={'xl'} mb={'lg'} ta={'center'} font={'body7'}>Рабочее место</VText>

        {quikTypeList.map((mt, index) => (
          <VCheckBox mt={!index ? undefined : 'lg'} key={index} isChecked={mt.isChecked} onPress={mt.onChange}
            text={quikListSelect.find(q => q.value === mt.domain.values[1])?.name} />
        ))}

        <VText mt={'xl'} mb={'lg'} ta={'center'} font={'body7'}>Дополнительно</VText>

        <VCheckBox isChecked={true} disabled text={'Прошу заключить дипозитарный договор'} />
        <VCheckBox mt={'lg'} isChecked={loan.isChecked} onPress={loan.onChange}
          text={'Прошу предоставить возможность совершения необеспеченных сделок'} />

        {type.value === EDAccountAgreementType.IIS && (
          <>
            <VText mt={'xl'} mb={'lg'} ta={'center'} font={'body7'}>Заявляю</VText>
            <VCheckBox isChecked={!IISOtherOwner.isChecked} onPress={IISOtherOwner.onChange}
              text={'Настоящим заявляю, что у меня отсутствует договор с другим профессиональным участником рынка ценных бумаг на ведение ИИС'} />
            <VCheckBox mt={'lg'} isChecked={IISOtherOwner.isChecked} onPress={IISOtherOwner.onChange}
              text={'Настоящим заявляю, что договор на ведение ИИС, заключенный с другим ' +
              'профессиональным участником, будет прекращён не позднее месяца с даты настоящего заявления'} />
          </>
        )}
      </>
    );
  }
}
