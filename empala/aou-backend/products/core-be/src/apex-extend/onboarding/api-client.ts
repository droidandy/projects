import { ApexTokenManager } from '../../utils/apex-token-manager';
import { ApplicationAnswer } from './onboarding-application';

interface ApexAnswerMultipleResponseSuccessItem {
  question_id: number;
  answer: {
    id: number;
    application_id: number;
    question_id: number;
    option_id: number | null;
    data: string | number | any;
    created_at: string;
    updated_at: string;
  };
}

interface ApexAnswerMultipleResponseErrorItem {
  question_id: number;
  errors: {
    data: string[];
  };
}

interface ApexAnswerMultipleResponse {
  answers: {
    success: ApexAnswerMultipleResponseSuccessItem[];
    error: ApexAnswerMultipleResponseErrorItem[];
  };
}

export const createApexApplication = async (userId: string): Promise<number> => {
  const response = await ApexTokenManager.sendAccountApiAxiosRequest('post', '/api/applications/create', {
    // eslint-disable-next-line camelcase
    user_id: userId,
  });
  return Number(response.data.application.id);
};

export const sendApplicationAnswers = async (applicationId: number, answers: ApplicationAnswer[]): Promise<ApexAnswerMultipleResponse> => {
  const response = await ApexTokenManager.sendAccountApiAxiosRequest('post', '/api/applications/answer-multiple', {
    // eslint-disable-next-line camelcase
    application_id: applicationId,
    answers,
  });
  return response.data;
};

export const deleteApplication = async (applicationId: number): Promise<void> => {
  await ApexTokenManager.sendAccountApiAxiosRequest('post', '/api/applications/delete', {
    // eslint-disable-next-line camelcase
    application_id: applicationId,
  });
};
