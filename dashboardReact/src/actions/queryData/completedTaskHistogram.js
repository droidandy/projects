import {
    batchActions
} from 'redux-batched-actions';

import {
    completedTasksHistogram as completedTasksHistogramRequest
} from 'services/completedTasksHistogram';


export const RECIEVE_PAGE_START = 'UI/COMPLETED_TASKS_HISTOGRAM/RECIEVE_PAGE_START';

export function receivePageStart() {
    return {
        type: RECIEVE_PAGE_START
    };
}

export const RECIEVE_PAGE_SUCCESS = 'UI/COMPLETED_TASKS_HISTOGRAM/RECIEVE_PAGE_SUCCESS';

export function receivePageSuccess(page) {
    return {
        type: RECIEVE_PAGE_SUCCESS,
        payload: page
    };
}

export const RECIEVE_PAGE_FAILURE = 'UI/COMPLETED_TASKS_HISTOGRAM/RECIEVE_PAGE_FAILURE';

export function receivePageFailure(errors) {
    return {
        type: RECIEVE_PAGE_FAILURE,
        payload: errors
    };
}

export function receivePage() {
    return (dispatch, getState) => {
        const { ui, queryData } = getState();

        if (queryData.completedTasksHistogram.busy) {
            return Promise.resolve();
        }

        dispatch(
            receivePageStart()
        );
        return completedTasksHistogramRequest(ui.dateRangePicker.startDate, ui.dateRangePicker.endDate)
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
