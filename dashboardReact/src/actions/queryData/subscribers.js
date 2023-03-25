import {
    batchActions
} from 'redux-batched-actions';

import {
    subscribers as subscribersRequest
} from 'services/subscribers';

import dataMapMarkerSubscribers from 'data/dataMapMarkerSubscribers';

export const RECIEVE_PAGE_START = 'UI/SUBSCRIBERS/RECIEVE_PAGE_START';

export function receivePageStart() {
    return {
        type: RECIEVE_PAGE_START
    };
}

export const RECIEVE_PAGE_SUCCESS = 'UI/SUBSCRIBERS/RECIEVE_PAGE_SUCCESS';

export function receivePageSuccess(page) {
    return {
        type: RECIEVE_PAGE_SUCCESS,
        payload: page
    };
}

export const RECIEVE_PAGE_FAILURE = 'UI/SUBSCRIBERS/RECIEVE_PAGE_FAILURE';

export function receivePageFailure(errors) {
    return {
        type: RECIEVE_PAGE_FAILURE,
        payload: errors
    };
}

export function receivePage() {
    return (dispatch, getState) => {
        const { ui, queryData } = getState();

        if (queryData.subscribers.busy) {
            return Promise.resolve();
        }

        dispatch(
            receivePageStart()
        );
        return subscribersRequest(ui.dateRangePicker.startDate, ui.dateRangePicker.endDate)
            // .then(data => {
            .then(() => {
                dispatch(
                    batchActions([
                        receivePageSuccess(dataMapMarkerSubscribers)
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
