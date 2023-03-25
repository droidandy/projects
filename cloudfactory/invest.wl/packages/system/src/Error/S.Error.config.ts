import { IErrorMessageMap, Injectable, ISErrorHttpDTO } from '@invest.wl/core';
import { ESErrorHttpCode, ESErrorSystemCode, ISErrorConfig } from './S.Error.types';

@Injectable()
export class SErrorConfig implements ISErrorConfig {
  public httpCode2Message: IErrorMessageMap<ISErrorHttpDTO> = {
    [ESErrorHttpCode.Server]: (c) => 'Сервер недоступен',
  };

  public httpMessage2Message: IErrorMessageMap<string> = {
    'Invalid user credentials': 'Не верно введен логин или пароль',
  };

  public systemCode2Message: IErrorMessageMap<string> = {
    [ESErrorSystemCode.ClassNotInitialized]: 'Класс не инициализирован',
    [ESErrorSystemCode.NoRefreshToken]: 'No refresh token for session update',
  };
}
