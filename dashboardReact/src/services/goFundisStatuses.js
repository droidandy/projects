import {
    isNull
} from 'lodash/fp';
import Maybe from 'data.maybe';

import config from 'config';

import {
    processResponse,
    processErrors
} from './common';

const METHOD = 'query/GetOverviewStats';


export function goFundisStatuses(from, to) {
    const query = encodeURIComponent(JSON.stringify(
        isNull(from) || isNull(to) ? {} :
        {
            timespan: {
                from: from ? from : null,
                to: to ? to : null
            }
        }
    ));
    return fetch(`${config.url}${config.version}${METHOD}?query=${query}`, {
        method: 'GET',
        mode: 'cors'
    })
        .then(processResponse, processErrors)
        .catch(errors => Promise.reject({
            common: Maybe.fromNullable(errors.non_field_errors)
        }));
}
