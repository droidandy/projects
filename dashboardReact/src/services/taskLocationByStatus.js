import {
    isNull,
    isArray,
    size
} from 'lodash/fp';
import Maybe from 'data.maybe';

import config from 'config';

import {
    processResponse,
    processErrors
} from './common';

const METHOD = 'query/TaskLocationByStatus';


export function taskLocationByStatus(from, to, status) {
    const query = isNull(from) || isNull(to) || !isArray(status) ? {} :
    {
        timespan: {
            from: from ? from : null,
            to: to ? to : null
        }
    };
    const queryAssign = encodeURIComponent(JSON.stringify(
        Object.assign(size(status) > 0 ? { status } : {}, query)));
    return fetch(`${config.url}${config.version}${METHOD}?query=${queryAssign}`, {
        method: 'GET',
        mode: 'cors'
    })
    .then(processResponse, processErrors)
    .catch(errors => Promise.reject({
        common: Maybe.fromNullable(errors.non_field_errors)
    }));
}
