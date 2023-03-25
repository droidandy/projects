import { FilterKey, DebitCardName } from 'store/types';
import { createDebitApplication } from 'api/application';
import { fireDebitFormSentAnalytics } from 'helpers/analytics';
import { enrichWithLeadSourceMeta } from 'helpers/cookies';
import { messageModalActions } from 'store/message-modal';
import { AsyncAction } from 'types/AsyncAction';
import { LeadFormData } from 'types/LeadFormData';
import { MessageModalName } from 'types/MessageModal';
import { actions } from './reducers';

type Query = Partial<Record<FilterKey, boolean> & { debitCardName: DebitCardName }>;
export const submitDebit = (data: LeadFormData, debitCardData: Query): AsyncAction => {
  return function (dispatch, getState) {
    const { user } = getState();
    dispatch(actions.setLoading(true));
    return createDebitApplication(
      enrichWithLeadSourceMeta(
        {
          phone: `+7${data.phone}`,
          name: data.name,
          debitCardData,
        },
        Date.now(),
      ),
    )
      .then(() => {
        dispatch(actions.setLoading(false));
        dispatch(actions.setInitial(true));
        dispatch(messageModalActions.open(MessageModalName.DEBIT_CARD_REQUEST_CREATED));
        fireDebitFormSentAnalytics(user.uuid, debitCardData.debitCardName);
      })
      .catch((err) => {
        dispatch(actions.setError(err));
      });
  };
};
