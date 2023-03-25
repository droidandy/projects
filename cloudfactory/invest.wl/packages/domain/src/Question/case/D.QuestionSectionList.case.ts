import { MapX } from '@invest.wl/common';
import { Inject, Injectable } from '@invest.wl/core';
import { makeObservable, observable } from 'mobx';
import { DQuestionStore } from '../D.Question.store';
import { DQuestionStoreTid } from '../D.Question.types';

export const DQuestionSectionListCaseTid = Symbol.for('DQuestionSectionListCase');

export interface IDQuestionSectionListCaseProps {
}

@Injectable()
export class DQuestionSectionListCase {
  @observable.ref public props?: IDQuestionSectionListCaseProps;

  public sectionListX = new MapX.DProxyList(
    () => this._store.sectionListX.list.filter(s => s.dto.code !== 'Hidden' && !!s.dto.name),
    this._store.sectionListX.source,
  );

  constructor(
    @Inject(DQuestionStoreTid) private _store: DQuestionStore,
  ) {
    makeObservable(this);
  }

  public init(props: IDQuestionSectionListCaseProps) {
    this.props = props;
  }
}
