import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DQuestionListCase, DQuestionListCaseTid } from './case/D.QuestionList.case';
import { DQuestionSectionListCase, DQuestionSectionListCaseTid } from './case/D.QuestionSectionList.case';
import { DQuestionGateway } from './D.Question.gateway';
import { DQuestionStore } from './D.Question.store';
import { DQuestionGatewayTid, DQuestionStoreTid } from './D.Question.types';
import { DQuestionModel, DQuestionModelTid, IDQuestionModel } from './model/D.Question.model';
import { DQuestionSectionModel, DQuestionSectionModelTid, IDQuestionSectionModel } from './model/D.QuestionSection.model';

export class DQuestionModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DQuestionGateway>(DQuestionGatewayTid).to(DQuestionGateway).inSingletonScope();
    ioc.bind<DQuestionStore>(DQuestionStoreTid).to(DQuestionStore).inSingletonScope();
    ioc.bind<DQuestionListCase>(DQuestionListCaseTid).to(DQuestionListCase);
    ioc.bind<DQuestionSectionListCase>(DQuestionSectionListCaseTid).to(DQuestionSectionListCase);

    ioc.bind<NewableType<IDQuestionModel>>(DQuestionModelTid).toConstructor<IDQuestionModel>(DQuestionModel);
    ioc.bind<NewableType<IDQuestionSectionModel>>(DQuestionSectionModelTid).toConstructor<IDQuestionSectionModel>(DQuestionSectionModel);
  }
}
