import { IDQuestionAnswerSaveDTO, IDQuestionListRequestDTO, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { DQuestionGateway } from '../D.Question.gateway';
import { DQuestionStore } from '../D.Question.store';
import { DQuestionGatewayTid, DQuestionStoreTid } from '../D.Question.types';
import { IDQuestionSectionModel } from '../model/D.QuestionSection.model';

export const DQuestionListCaseTid = Symbol.for('DQuestionListCaseTid');

export interface IDQuestionListCaseProps extends Pick<IDQuestionListRequestDTO, 'answerWith'> {
  section: IDQuestionSectionModel;
}

@Injectable()
export class DQuestionListCase {
  @observable.ref public props?: IDQuestionListCaseProps;
  @observable public isBusy = false;

  public listX = this._gw.list({
    name: 'DQuestionSectionCase._list',
    req: () => this.props ? {
      sectionList: this.props.section.sectionsRequest, answerWith: this.props.answerWith,
    } : undefined,
  });

  constructor(
    @Inject(DQuestionGatewayTid) private _gw: DQuestionGateway,
    @Inject(DQuestionStoreTid) private _questionStore: DQuestionStore,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
    // @Inject(SConfigStoreTid) private _const: ISConfigStore,
    // @Inject(DCountryStoreTid) private _countryStore: DCountryStore,
    // @Inject(DTaxResidenceStoreTid) private _taxResidenceStore: DTaxResidenceStore,
  ) {
    makeObservable(this);
  }

  @action
  public async init(props: IDQuestionListCaseProps) {
    this.props = props;

    // if (this.isFatcaCrs) {
    //   // TODO: reactive form build
    //   when(() => !!this._taxResidenceStore.listHolder.list?.[0]?.dto, () => {
    //     const list = this._taxResidenceStore.listHolder.list;
    //     if (list.length) {
    //       this._taxResidenceList.pop();
    //       // TODO: reactive form build. значение не успевает обновиться, перед тем как мы его заберем
    //       setTimeout(() => {
    //         list.forEach(tr => this._taxResidenceList.push(new DTaxResidenceEditModel(tr)));
    //       });
    //     }
    //   });
    // }
  }

  @computed
  public get isFatcaCrs() {
    return this.props?.section.dto.code === 'FatcaCrs';
  }

  @computed
  public get isValid() {
    return this.listX.list.every(q => q.isValid);
    // && (this.isFatcaCrs ? this.taxResidenceValid : true);
  }

  @action.bound
  public async save() {
    try {
      if (!this.isValid) throw this._errorService.businessHandle('Не заполнены поля анкеты');
      this.isBusy = true;
      const answerList = this.listX.list.map(q => q.asAnswer()).filter(q => !!q) as IDQuestionAnswerSaveDTO[];
      if (answerList.length) await this._questionStore.save(answerList);
      // if (this.isFatcaCrs) await this._taxResidenceStore.save(this.taxResidenceList.map(tr => tr.dto));
    } catch (e: any) {
      e.message = `Ошибка при сохранении анкеты. ${e.message}`;
      throw e;
    } finally {
      runInAction(() => this.isBusy = false);
    }
  }

  // public get countryListX() {
  //   return this._countryStore.listX;
  // }

  // @observable private _taxResidenceList: DTaxResidenceEditModel[] = [new DTaxResidenceEditModel()];

  // @computed
  // public get needSign() {
  //   return !!this._const.documentTemplateMap[this.props?.section.dto?.code!]?.length;
  // }

  // @computed
  // public get taxResidenceList() {
  //   return this.taxResidenceShow ? this._taxResidenceList : [];
  // }

  // @computed
  // public get taxResidenceShow() {
  //   return this.listSorted[this._const.questionFatcaResidenceOrdinal]?.isTrue;
  // }

  // @action.bound
  // public async taxResidenceAdd() {
  //   this._taxResidenceList.push(new DTaxResidenceEditModel());
  // }

  // @action.bound
  // public async taxResidenceRemove(item: DTaxResidenceEditModel) {
  //   this._taxResidenceList = this._taxResidenceList.filter(i => i !== item);
  // }
}
