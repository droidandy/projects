import {
    batchActions
} from 'redux-batched-actions';

import {
    taskCategoryBreakdown as taskCategoryBreakdownRequest
} from 'services/taskCategoryBreakdown';

import dataTaskCategoryBreakdown from 'data/dataTaskCategoryBreakdown';

export const RECIEVE_PAGE_START = 'UI/TASK_CATEGORY_BREAKDOWN/RECIEVE_PAGE_START';

export function receivePageStart() {
    return {
        type: RECIEVE_PAGE_START
    };
}

export const RECIEVE_PAGE_SUCCESS = 'UI/TASK_CATEGORY_BREAKDOWN/RECIEVE_PAGE_SUCCESS';

export function receivePageSuccess(page) {
    return {
        type: RECIEVE_PAGE_SUCCESS,
        payload: page
    };
}

export const RECIEVE_PAGE_FAILURE = 'UI/TASK_CATEGORY_BREAKDOWN/RECIEVE_PAGE_FAILURE';

export function receivePageFailure(errors) {
    return {
        type: RECIEVE_PAGE_FAILURE,
        payload: errors
    };
}

export function receivePage() {
    return (dispatch, getState) => {
        const { ui, queryData } = getState();

        if (queryData.taskCategoryBreakdown.busy) {
            return Promise.resolve();
        }

        dispatch(
            receivePageStart()
        );
        return taskCategoryBreakdownRequest(ui.dateRangePicker.startDate, ui.dateRangePicker.endDate)
            // .then(data => {
            .then(() => {
                dispatch(
                    batchActions([
                        receivePageSuccess(dataTaskCategoryBreakdown)
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
