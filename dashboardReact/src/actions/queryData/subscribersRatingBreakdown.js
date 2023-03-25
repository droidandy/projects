import {
    batchActions
} from 'redux-batched-actions';

import {
    subscribersRatingBreakdown as subscribersRatingBreakdownRequest
} from 'services/subscribersRatingBreakdown';

import dataSubscribersRatingBreakdown from 'data/dataSubscribersRatingBreakdown';

export const RECIEVE_PAGE_START = 'UI/SUBSCRIBERS_RATING_BREAKDOWN/RECIEVE_PAGE_START';

export function receivePageStart() {
    return {
        type: RECIEVE_PAGE_START
    };
}

export const RECIEVE_PAGE_SUCCESS = 'UI/SUBSCRIBERS_RATING_BREAKDOWN/RECIEVE_PAGE_SUCCESS';

export function receivePageSuccess(page) {
    return {
        type: RECIEVE_PAGE_SUCCESS,
        payload: page
    };
}

export const RECIEVE_PAGE_FAILURE = 'UI/SUBSCRIBERS_RATING_BREAKDOWN/RECIEVE_PAGE_FAILURE';

export function receivePageFailure(errors) {
    return {
        type: RECIEVE_PAGE_FAILURE,
        payload: errors
    };
}

export function receivePage() {
    return (dispatch, getState) => {
        const { ui, queryData } = getState();

        if (queryData.subscribersRatingBreakdown.busy) {
            return Promise.resolve();
        }

        dispatch(
            receivePageStart()
        );
        return subscribersRatingBreakdownRequest(ui.dateRangePicker.startDate, ui.dateRangePicker.endDate)
            // .then(data => {
            .then(() => {
                dispatch(
                    batchActions([
                        receivePageSuccess(dataSubscribersRatingBreakdown)
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
