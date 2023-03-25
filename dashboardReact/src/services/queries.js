import {
    curry
} from 'lodash/fp';

export const encodeQuery = curry(
    (query, value) => ({[query]: value})
);
