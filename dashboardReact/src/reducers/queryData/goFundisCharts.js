import {
    Just,
    Nothing
} from 'data.maybe';
import {
    formatDate
} from 'utils/format-date';
import {
    RECIEVE_PAGE_START,
    RECIEVE_PAGE_SUCCESS,
    RECIEVE_PAGE_FAILURE
} from 'actions/queryData/goFundisCharts';

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
                results: Just({
                    fundiLiveActive: {
                        series: [{
                            data: (payload.fundiLiveActive && payload.fundiLiveActive.series) ?
                                payload.fundiLiveActive.series.data.map(ser => ({
                                    ...ser,
                                    drilldown: null,
                                    name: ser.name ? ser.name : '',
                                    y: ser.y ? ser.y : 0
                                })) : []
                        }]
                    },
                    fundiNumber: {
                        xAxis: {
                            categories: (payload.fundiNumber && payload.fundiNumber.xAxis) ?
                                payload.fundiNumber.xAxis.map(field => (formatDate(field))) : []
                        },
                        series: (payload.fundiNumber && payload.fundiNumber.series) ?
                            payload.fundiNumber.series.map(ser => ({
                                name: ser.name ? ser.name : '',
                                data: ser.data ? ser.data : []
                            })) : []
                    }
                }),
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
