import {
    batchActions
} from 'redux-batched-actions';
// import {
//     TASK_STATYS_ALL
// } from 'models/googlemap';
// import {
//     map,
//     findIndex
// } from 'lodash/fp';
import {
    taskLocationByStatus as taskLocationByStatusRequest
} from 'services/taskLocationByStatus';


export const RECIEVE_PAGE_START = 'UI/TASK_LOCATION_STATUS/RECIEVE_PAGE_START';

export function receivePageStart() {
    return {
        type: RECIEVE_PAGE_START
    };
}

export const RECIEVE_PAGE_SUCCESS = 'UI/TASK_LOCATION_STATUS/RECIEVE_PAGE_SUCCESS';

export function receivePageSuccess(page) {
    return {
        type: RECIEVE_PAGE_SUCCESS,
        payload: page
    };
}

export const RECIEVE_PAGE_FAILURE = 'UI/TASK_LOCATION_STATUS/RECIEVE_PAGE_FAILURE';

export function receivePageFailure(errors) {
    return {
        type: RECIEVE_PAGE_FAILURE,
        payload: errors
    };
}

export function receivePage() {
    return (dispatch, getState) => {
        const { ui, queryData } = getState();

        if (queryData.taskLocationByStatus.busy) {
            return Promise.resolve();
        }
        // TODO fix tasks send query to JUST with Value
        const toSendTasksTypes = ui.googlemap.tasks.cata({
            Nothing: () => ([]),
            Just: () => ([])
            // Just: value => (
            //     (!~findIndex(optionItem => optionItem === TASK_STATYS_ALL, value)) ?
            //         (map(taskType => (taskType.toLowerCase()), value)) : ([])
            // )
        });
        dispatch(
            receivePageStart()
        );

        return taskLocationByStatusRequest(ui.dateRangePicker.startDate, ui.dateRangePicker.endDate, toSendTasksTypes)
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
