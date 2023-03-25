import API, { CancellableAxiosPromise } from 'api/request';
import { CreateCreditApplicationParamsDTO } from 'dtos/CreateCreditApplicationParamsDTO';

// TODO: Удалить utm метки
function createCreditFisApplication(params: CreateCreditApplicationParamsDTO): CancellableAxiosPromise<any> {
  return API.post(
    '/application/credit-fis',
    {
      ...params,
      utm: {
        utm_source: 'utm_source',
        utm_medium: 'utm_medium',
        utm_campaign: 'utm_campaign',
        utm_content: 'utm_content',
        utm_term: 'utm_term',
        utm_user_agent: 'utm_user_agent',
      },
    },
    {
      authRequired: true,
      withCredentials: true,
    },
  );
}

export { createCreditFisApplication };
