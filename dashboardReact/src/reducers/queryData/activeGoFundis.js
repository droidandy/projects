import {
    Just,
    Nothing
} from 'data.maybe';
import {
    filter,
    map
} from 'lodash/fp';
import {
    USER_TYPE_GOFUNDI
} from 'models/googlemap';
import {
    RECIEVE_PAGE_START,
    RECIEVE_PAGE_SUCCESS,
    RECIEVE_PAGE_FAILURE
} from 'actions/queryData/activeGoFundis';

export const initialState = {
    results: Nothing(),
    busy: false,
    errors: Nothing()
};

export function reducer(state, action) {
    const { type, payload } = action;
    switch (type) {
        case RECIEVE_PAGE_START: {
            return {
                ...state,
                results: state.results.cata({
                    Nothing: () => (Nothing()),
                    Just: entity => (Just(entity))
                }),
                busy: true,
                errors: Nothing()
            };
        }
        case RECIEVE_PAGE_SUCCESS: {
            return {
                ...state,
                results: Just(map(item => ({
                    ...item,
                    type: item.status.toUpperCase()
                }), filter(user => user.type === USER_TYPE_GOFUNDI.toLowerCase(), payload))),
                busy: false
            };
        }

        case RECIEVE_PAGE_FAILURE: {
            return {
                ...state,
                busy: false,
                errors: Just(payload)
            };
        }

        default: {
            return state;
        }
    }
}
