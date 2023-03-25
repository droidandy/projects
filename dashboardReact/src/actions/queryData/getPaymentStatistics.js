import {
    batchActions
} from 'redux-batched-actions';

import {
    getPaymentStatistics as getPaymentStatisticsRequest
} from 'services/getPaymentStatistics';


export const RECIEVE_PAGE_START = 'UI/GET_PAYMENT_STATISTICS/RECIEVE_PAGE_START';

export function receivePageStart() {
    return {
        type: RECIEVE_PAGE_START
    };
}

export const RECIEVE_PAGE_SUCCESS = 'UI/GET_PAYMENT_STATISTICS/RECIEVE_PAGE_SUCCESS';

export function receivePageSuccess(page) {
    return {
        type: RECIEVE_PAGE_SUCCESS,
        payload: page
    };
}

export const RECIEVE_PAGE_FAILURE = 'UI/GET_PAYMENT_STATISTICS/RECIEVE_PAGE_FAILURE';

export function receivePageFailure(errors) {
    return {
        type: RECIEVE_PAGE_FAILURE,
        payload: errors
    };
}

export function receivePage() {
    return (dispatch, getState) => {
        const { ui, queryData } = getState();

        if (queryData.getPaymentStatistics.busy) {
            return Promise.resolve();
        }

        dispatch(
            receivePageStart()
        );
        return getPaymentStatisticsRequest(ui.dateRangePicker.startDate, ui.dateRangePicker.endDate)
            .then(data => {
                dispatch(
                    batchActions([
                        receivePageSuccess(data)
                    ])
                );
            })
            .catch(errors => {
                dispatch(
                    receivePageFailure(errors)
                );
            });
    };
}
