import {
    batchActions
} from 'redux-batched-actions';

import {
    goFundisCharts as goFundisChartsRequest
} from 'services/goFundisCharts';

import dataGoFundisCharts from 'data/dataGoFundisCharts';

export const RECIEVE_PAGE_START = 'UI/GOFUNDIS_CHARTS/RECIEVE_PAGE_START';

export function receivePageStart() {
    return {
        type: RECIEVE_PAGE_START
    };
}

export const RECIEVE_PAGE_SUCCESS = 'UI/GOFUNDIS_CHARTS/RECIEVE_PAGE_SUCCESS';

export function receivePageSuccess(page) {
    return {
        type: RECIEVE_PAGE_SUCCESS,
        payload: page
    };
}

export const RECIEVE_PAGE_FAILURE = 'UI/GOFUNDIS_CHARTS/RECIEVE_PAGE_FAILURE';

export function receivePageFailure(errors) {
    return {
        type: RECIEVE_PAGE_FAILURE,
        payload: errors
    };
}

export function receivePage() {
    return (dispatch, getState) => {
        const { ui, queryData } = getState();

        if (queryData.goFundisCharts.busy) {
            return Promise.resolve();
        }

        dispatch(
            receivePageStart()
        );
        return goFundisChartsRequest(ui.dateRangePicker.startDate, ui.dateRangePicker.endDate)
            // .then(data => {
            .then(() => {
                dispatch(
                    batchActions([
                        receivePageSuccess(dataGoFundisCharts)
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
