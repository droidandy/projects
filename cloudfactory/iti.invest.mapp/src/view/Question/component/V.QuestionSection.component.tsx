import React from 'react';
import { observer } from 'mobx-react';
import { IVQuestionModel } from '@invest.wl/view/src/Question/model/V.Question.model';
import { computed, makeObservable } from 'mobx';
import { EDQuestionSection, IoC } from '@invest.wl/core';
import { VCol, VText } from '@invest.wl/mobile/src/view/kit';
import groupBy from 'lodash/groupBy';
import { VQuestion } from './V.Question.component';
import { IVQuestionI18n, VQuestionI18nTid } from '@invest.wl/view/src/Question/V.Question.types';

export interface IVQuestionSectionProps {
  section: EDQuestionSection;
  list: IVQuestionModel[];
  titleShow?: boolean;
}

@observer
export class VQuestionSection extends React.Component<IVQuestionSectionProps> {
  private _i18n = IoC.get<IVQuestionI18n>(VQuestionI18nTid);

  constructor(props: IVQuestionSectionProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  public get listGrouped() {
    return Object.values(groupBy(this.props.list, (v) => v.domain.dto.section));
  }

  public render() {
    const { section, children, titleShow } = this.props;

    return (
      <VCol flex>
        {titleShow !== false && (
          <VText mb={'xl'} ta={'center'} font={'body5'}>{this._i18n.section[section]}</VText>
        )}

        {this.listGrouped.map((lg, index) => (
          <VCol mt={index ? 30 : 0} key={index}>
            {lg.map(q => (<VQuestion mt={'lg'} key={q.id} model={q} />))}
          </VCol>
        ))}
        {children}
      </VCol>
    );
  }
}
