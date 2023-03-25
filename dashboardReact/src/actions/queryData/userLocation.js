import {
    batchActions
} from 'redux-batched-actions';
import {
    USER_TYPE_SUBSCRIBER,
    USER_TYPE_GOFUNDI,
    USER_TYPE_ALL
} from 'models/googlemap';
import {
    findIndex
} from 'lodash/fp';
import {
    getUserTypes
} from 'utils';
import {
    listUserLocations as listUserLocationsRequest
} from 'services/userLocation';


export const RECIEVE_PAGE_START = 'UI/USER_LOCATION_LIST/RECIEVE_PAGE_START';

export function receivePageStart() {
    return {
        type: RECIEVE_PAGE_START
    };
}

export const RECIEVE_PAGE_SUCCESS = 'UI/USER_LOCATION_LIST/RECIEVE_PAGE_SUCCESS';

export function receivePageSuccess(page) {
    return {
        type: RECIEVE_PAGE_SUCCESS,
        payload: page
    };
}

export const RECIEVE_PAGE_FAILURE = 'UI/USER_LOCATION_LIST/RECIEVE_PAGE_FAILURE';

export function receivePageFailure(errors) {
    return {
        type: RECIEVE_PAGE_FAILURE,
        payload: errors
    };
}

export function receivePage() {
    return (dispatch, getState) => {
        const { ui, queryData } = getState();

        if (queryData.userLocation.busy) {
            return Promise.resolve();
        }
        const toSendUserTypes = ui.googlemap.users.cata({
            Nothing: () => ([USER_TYPE_SUBSCRIBER.toLowerCase(), USER_TYPE_GOFUNDI.toLowerCase()]),
            Just: fields => (!~findIndex(optionItem => optionItem === USER_TYPE_ALL, fields) ?
                getUserTypes(fields) : [USER_TYPE_SUBSCRIBER.toLowerCase(), USER_TYPE_GOFUNDI.toLowerCase()])
        });
        dispatch(
            receivePageStart()
        );
        return listUserLocationsRequest(toSendUserTypes)
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
