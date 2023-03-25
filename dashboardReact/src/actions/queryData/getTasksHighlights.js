import {
    batchActions
} from 'redux-batched-actions';

import {
    getTasksHighlights as getTasksHighlightsRequest
} from 'services/getTasksHighlights';

import dataTasksHighlights from 'data/dataTasksHighlights';

export const RECIEVE_PAGE_START = 'UI/GET_TASKS_HIGHTLIGHTS/RECIEVE_PAGE_START';

export function receivePageStart() {
    return {
        type: RECIEVE_PAGE_START
    };
}

export const RECIEVE_PAGE_SUCCESS = 'UI/GET_TASKS_HIGHTLIGHTS/RECIEVE_PAGE_SUCCESS';

export function receivePageSuccess(page) {
    return {
        type: RECIEVE_PAGE_SUCCESS,
        payload: page
    };
}

export const RECIEVE_PAGE_FAILURE = 'UI/GET_TASKS_HIGHTLIGHTS/RECIEVE_PAGE_FAILURE';

export function receivePageFailure(errors) {
    return {
        type: RECIEVE_PAGE_FAILURE,
        payload: errors
    };
}

export function receivePage() {
    return (dispatch, getState) => {
        const { ui, queryData } = getState();

        if (queryData.getTasksHighlights.busy) {
            return Promise.resolve();
        }

        dispatch(
            receivePageStart()
        );
        return getTasksHighlightsRequest(ui.dateRangePicker.startDate, ui.dateRangePicker.endDate)
            // .then(data => {
            .then(() => {
                dispatch(
                    batchActions([
                        receivePageSuccess(dataTasksHighlights)
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
