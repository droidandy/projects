import {
    isNull,
    isString
} from 'lodash/fp';
import Maybe from 'data.maybe';

import config from 'config';

import {
    processResponse,
    processErrors
} from './common';

const METHOD = 'query/TaskLocationByCategory';


export function taskLocationByCategory(from, to, category) {
    const query = isNull(from) || isNull(to) || !isString(category) ? {} :
    {
        timespan: {
            from: from ? from : null,
            to: to ? to : null
        }
    };
    const queryAssign = encodeURIComponent(JSON.stringify(
        Object.assign(category.length > 0 ? { category } : {}, query)));
    return fetch(`${config.url}${config.version}${METHOD}?query=${queryAssign}`, {
        method: 'GET',
        mode: 'cors'
    })
    .then(processResponse, processErrors)
    .catch(errors => Promise.reject({
        common: Maybe.fromNullable(errors.non_field_errors)
    }));
}
