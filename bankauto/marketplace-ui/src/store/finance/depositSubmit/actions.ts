import { createDepositApplication } from 'api/application';
import { fireDepositFormSentAnalytics } from 'helpers/analytics';
import { enrichWithLeadSourceMeta } from 'helpers/cookies';
import { messageModalActions } from 'store/message-modal';
import { AsyncAction } from 'types/AsyncAction';
import { LeadFormData } from 'types/LeadFormData';
import { MessageModalName } from 'types/MessageModal';
import { CREDIT_SOURCE } from 'constants/credit';
import { actions } from './reducers';

export const submitDeposit = (data: LeadFormData): AsyncAction => {
  return function (dispatch, getState) {
    const { depositCalculator, user } = getState();

    dispatch(actions.setLoading(true));
    return createDepositApplication(
      enrichWithLeadSourceMeta(
        {
          phone: `+7${data.phone}`,
          name: data.name,
          source: CREDIT_SOURCE,
          deposit: depositCalculator,
        },
        // Пришлось обрезать, так как бек не может принять в timestap число, которое состоит из более чем 10 символов
        Math.round(Date.now() / 1000),
      ),
    )
      .then(() => {
        dispatch(actions.setLoading(false));
        dispatch(actions.setInitial(true));
        dispatch(messageModalActions.open(MessageModalName.DEPOSIT_CREATED));
        fireDepositFormSentAnalytics(user.uuid);
      })
      .catch((err) => {
        dispatch(actions.setError(err));
      });
  };
};
