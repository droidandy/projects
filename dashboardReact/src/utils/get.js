import {
    curry,
    size,
    some,
    map,
    has
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';
import {
    USER_TYPE_SUBSCRIBER,
    USER_TYPE_GOFUNDI
} from 'models/googlemap';

/**
 * Extract the value of key that may success.
 *
 * @type String -> Dict String b -> Maybe b
 */
export const get = curry(
    (key, dict) => !has(key, dict) ?
        Nothing() :
        Just(dict[ key ])
);

export const getUserTypes = curry(
    fields => (
        !some(size(fields), fields) ?
            [USER_TYPE_SUBSCRIBER.toLowerCase(), USER_TYPE_GOFUNDI.toLowerCase()] :
            map(type => (type.toLowerCase()), fields))
);
