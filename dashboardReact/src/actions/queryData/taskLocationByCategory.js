import {
    batchActions
} from 'redux-batched-actions';

import {
    taskLocationByCategory as taskLocationByCategoryRequest
} from 'services/taskLocationByCategory';

export const RECIEVE_PAGE_START = 'UI/TASK_LOCATION_CATEGORY/RECIEVE_PAGE_START';

export function receivePageStart() {
    return {
        type: RECIEVE_PAGE_START
    };
}

export const RECIEVE_PAGE_SUCCESS = 'UI/TASK_LOCATION_CATEGORY/RECIEVE_PAGE_SUCCESS';

export function receivePageSuccess(page) {
    return {
        type: RECIEVE_PAGE_SUCCESS,
        payload: page
    };
}

export const RECIEVE_PAGE_FAILURE = 'UI/TASK_LOCATION_CATEGORY/RECIEVE_PAGE_FAILURE';

export function receivePageFailure(errors) {
    return {
        type: RECIEVE_PAGE_FAILURE,
        payload: errors
    };
}

export function receivePage() {
    return (dispatch, getState) => {
        const { ui, queryData } = getState();

        if (queryData.taskLocationByCategory.busy) {
            return Promise.resolve();
        }
        const toSendCategoriesTypes = ui.googlemap.categories.cata({
            Nothing: () => (''),
            Just: value => (value)
        });
        dispatch(
            receivePageStart()
        );

        return taskLocationByCategoryRequest(
            ui.dateRangePicker.startDate,
            ui.dateRangePicker.endDate,
            toSendCategoriesTypes)
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
