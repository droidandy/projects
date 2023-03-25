import {
    batchActions
} from 'redux-batched-actions';

import {
    getRevenueHistogram as getRevenueHistogramRequest
} from 'services/getRevenueHistogram';


export const RECIEVE_PAGE_START = 'UI/GET_REVENUE_HISTOGRAM/RECIEVE_PAGE_START';

export function receivePageStart() {
    return {
        type: RECIEVE_PAGE_START
    };
}

export const RECIEVE_PAGE_SUCCESS = 'UI/GET_REVENUE_HISTOGRAM/RECIEVE_PAGE_SUCCESS';

export function receivePageSuccess(page) {
    return {
        type: RECIEVE_PAGE_SUCCESS,
        payload: page
    };
}

export const RECIEVE_PAGE_FAILURE = 'UI/GET_REVENUE_HISTOGRAM/RECIEVE_PAGE_FAILURE';

export function receivePageFailure(errors) {
    return {
        type: RECIEVE_PAGE_FAILURE,
        payload: errors
    };
}

export function receivePage() {
    return (dispatch, getState) => {
        const { ui, queryData } = getState();

        if (queryData.getRevenueHistogram.busy) {
            return Promise.resolve();
        }

        dispatch(
            receivePageStart()
        );
        return getRevenueHistogramRequest(ui.dateRangePicker.startDate, ui.dateRangePicker.endDate)
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
