import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVQuestionModel, VQuestionModel, VQuestionModelTid } from './model/V.Question.model';
import { IVQuestionSectionModel, VQuestionSectionModel, VQuestionSectionModelTid } from './model/V.QuestionSection.model';
import { VQuestionListPresent, VQuestionListPresentTid } from './present/V.QuestionList.present';
import { VQuestionSectionListPresent, VQuestionSectionListPresentTid } from './present/V.QuestionSectionList.present';
import { VQuestionI18n } from './V.Question.i18n';
import { IVQuestionI18n, VQuestionI18nTid } from './V.Question.types';

export class VQuestionModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<IVQuestionI18n>(VQuestionI18nTid).to(VQuestionI18n).inSingletonScope();
    ioc.bind<VQuestionListPresent>(VQuestionListPresentTid).to(VQuestionListPresent);
    ioc.bind<VQuestionSectionListPresent>(VQuestionSectionListPresentTid).to(VQuestionSectionListPresent);

    ioc.bind<NewableType<IVQuestionModel>>(VQuestionModelTid).toConstructor<IVQuestionModel>(VQuestionModel);
    ioc.bind<NewableType<IVQuestionSectionModel>>(VQuestionSectionModelTid).toConstructor<IVQuestionSectionModel>(VQuestionSectionModel);
  }
}
