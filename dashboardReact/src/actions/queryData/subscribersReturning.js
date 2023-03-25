import {
    batchActions
} from 'redux-batched-actions';

import {
    subscribersReturning as subscribersReturningRequest
} from 'services/subscribersReturning';

import dataSubscribersReturning from 'data/dataSubscribersReturning';

export const RECIEVE_PAGE_START = 'UI/SUBSCRIBERS_RETURNING/RECIEVE_PAGE_START';

export function receivePageStart() {
    return {
        type: RECIEVE_PAGE_START
    };
}

export const RECIEVE_PAGE_SUCCESS = 'UI/SUBSCRIBERS_RETURNING/RECIEVE_PAGE_SUCCESS';

export function receivePageSuccess(page) {
    return {
        type: RECIEVE_PAGE_SUCCESS,
        payload: page
    };
}

export const RECIEVE_PAGE_FAILURE = 'UI/SUBSCRIBERS_RETURNING/RECIEVE_PAGE_FAILURE';

export function receivePageFailure(errors) {
    return {
        type: RECIEVE_PAGE_FAILURE,
        payload: errors
    };
}

export function receivePage() {
    return (dispatch, getState) => {
        const { ui, queryData } = getState();

        if (queryData.subscribersReturning.busy) {
            return Promise.resolve();
        }

        dispatch(
            receivePageStart()
        );
        return subscribersReturningRequest(ui.dateRangePicker.startDate, ui.dateRangePicker.endDate)
            // .then(data => {
            .then(() => {
                dispatch(
                    batchActions([
                        receivePageSuccess(dataSubscribersReturning)
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
