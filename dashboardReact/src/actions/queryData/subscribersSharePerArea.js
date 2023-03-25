import {
    batchActions
} from 'redux-batched-actions';

import {
    subscribersSharePerArea as subscribersSharePerAreaRequest
} from 'services/subscribersSharePerArea';

import dataSubscribersSharePerArea from 'data/dataSubscribersSharePerArea';

export const RECIEVE_PAGE_START = 'UI/SUBSCRIBERS_SHARE_PER_AREA/RECIEVE_PAGE_START';

export function receivePageStart() {
    return {
        type: RECIEVE_PAGE_START
    };
}

export const RECIEVE_PAGE_SUCCESS = 'UI/SUBSCRIBERS_SHARE_PER_AREA/RECIEVE_PAGE_SUCCESS';

export function receivePageSuccess(page) {
    return {
        type: RECIEVE_PAGE_SUCCESS,
        payload: page
    };
}

export const RECIEVE_PAGE_FAILURE = 'UI/SUBSCRIBERS_SHARE_PER_AREA/RECIEVE_PAGE_FAILURE';

export function receivePageFailure(errors) {
    return {
        type: RECIEVE_PAGE_FAILURE,
        payload: errors
    };
}

export function receivePage() {
    return (dispatch, getState) => {
        const { ui, queryData } = getState();

        if (queryData.subscribersSharePerArea.busy) {
            return Promise.resolve();
        }

        dispatch(
            receivePageStart()
        );
        return subscribersSharePerAreaRequest(ui.dateRangePicker.startDate, ui.dateRangePicker.endDate)
            // .then(data => {
            .then(() => {
                dispatch(
                    batchActions([
                        receivePageSuccess(dataSubscribersSharePerArea)
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
