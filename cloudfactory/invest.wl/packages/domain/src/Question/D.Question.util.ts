import { IDQuestionDTO } from '@invest.wl/core';

export class DQuestionUtil {
  public static order(list?: IDQuestionDTO[]) {
    return list?.length ? [...list].sort((a, b) => a.ordering - b.ordering) : undefined;
  }
}
