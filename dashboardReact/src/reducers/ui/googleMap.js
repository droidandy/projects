import {
    isNil,
    concat,
    findIndex,
    reject,
    curry,
    property,
    isEqual,
    size
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';
import {
    CATEGORY_ALL,
    TASK_STATYS_ALL,
    USER_TYPE_ALL,
    GOFUNDIS_ALL
} from 'models/googlemap';
import {
    SHOW_USERS,
    SHOW_TASKS,
    SHOW_CATEGORY,
    SET_CATEGORY,
    SHOW_GOFUNDIS
} from 'actions/ui/googleMap';
import {
    capitalize
} from 'utils';
export const initialState = {
    users: Just(['ALL']),
    tasks: Just(['ALL']),
    categories: Just([{
        value: CATEGORY_ALL,
        label: capitalize(CATEGORY_ALL)
    }]),
    goFundis: Just(['ALL'])
};

const pType = property('type');
const pObq = property('obq');
const pValue = property('value');

const checkAllCategorySelectEnd = curry(
    payload => (
        (findIndex({value: CATEGORY_ALL,
            label: capitalize(CATEGORY_ALL)
        }, pValue(payload)) === size(pValue(payload)) - 1 && size(pValue(payload)) >= 1) ?
            (Just([{value: CATEGORY_ALL,
                label: capitalize(CATEGORY_ALL)
            }])) :
            (Just(reject({value: CATEGORY_ALL,
                label: capitalize(CATEGORY_ALL)
            }, pValue(payload))))
    )
);

const checkAllCategorySelect = curry(
    payload => (
        (findIndex({value: CATEGORY_ALL,
            label: capitalize(CATEGORY_ALL)
        }, pValue(payload)) === 0 && size(pValue(payload)) >= 1) ?
            (Just(reject({value: CATEGORY_ALL,
                label: capitalize(CATEGORY_ALL)
            }, pValue(payload)))) :
            checkAllCategorySelectEnd(payload)
    )
);
const checkAllCategorySelectEmpty = curry(
    payload => (
        (size(pValue(payload)) === 1) ?
            (Just(pValue(payload))) :
            checkAllCategorySelect(payload)
    )
);

const checkAllGoFundis = curry(
    (payload, entity) => (
        (isEqual(GOFUNDIS_ALL, pType(payload))) ?
            (Just([pType(payload)])) :
            (Just(concat(pType(payload), reject(rItem => rItem === GOFUNDIS_ALL, entity))))
    )
);
const filterGoFundis = curry(
    (payload, entity) => (
        (!~findIndex(item => (item === pType(payload)), entity)) ?
            (Just(entity)) : (Just(reject(rItem => rItem === pType(payload), entity)))
    )
);

const checkAllUser = curry(
    (payload, entity) => (
        (isEqual(USER_TYPE_ALL, pType(payload))) ?
            (Just([pType(payload)])) :
            (Just(concat(pType(payload), reject(rItem => rItem === USER_TYPE_ALL, entity))))
    )
);
const filterUser = curry(
    (payload, entity) => (
        (!~findIndex(item => (item === pType(payload)), entity)) ?
            (Just(entity)) : (Just(reject(rItem => rItem === pType(payload), entity)))
    )
);

const checkAllTask = curry(
    (payload, entity) => (
        (isEqual(TASK_STATYS_ALL, pType(payload))) ?
            (Just([pType(payload)])) :
            (Just(concat(pType(payload), reject(rItem => rItem === TASK_STATYS_ALL, entity))))
    )
);
const filterTask = curry(
    (payload, entity) => (
        (!~findIndex(item => (item === pType(payload)), entity)) ?
            (Just(entity)) : (Just(reject(rItem => rItem === pType(payload), entity)))
    )
);
const checkAllCategory = curry(
    (payload, entity) => (
        (isEqual({
            value: CATEGORY_ALL,
            label: capitalize(CATEGORY_ALL)
        }, pObq(payload))) ?
            (Just([pObq(payload)])) :
            (Just(concat(pObq(payload), reject({
                value: CATEGORY_ALL,
                label: capitalize(CATEGORY_ALL)
            }, entity))))
    )
);
const filterCategory = curry(
    (payload, entity) => (
        (!~findIndex(pObq(payload), entity)) ? (Just(entity)) : (Just(reject(pObq(payload), entity)))
    )
);
export function reducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {

        case SHOW_USERS: {

            return {
                ...state,
                users: state.users.cata({
                    Just: entity => (pValue(payload)) ?
                        checkAllUser(payload, entity) :
                        filterUser(payload, entity),
                    Nothing: () => !isNil(pType(payload)) ? Just([pType(payload)]) : Nothing()
                })
            };
        }
        case SHOW_TASKS: {

            return {
                ...state,
                tasks: state.tasks.cata({
                    Just: entity => (pValue(payload)) ?
                        checkAllTask(payload, entity) :
                        filterTask(payload, entity),
                    Nothing: () => !isNil(pType(payload)) ? Just([pType(payload)]) : Nothing()
                })
            };
        }
        case SET_CATEGORY: {

            return {
                ...state,
                categories: state.categories.cata({
                    Just: entity => (pValue(payload)) ?
                        checkAllCategory(payload, entity) :
                        filterCategory(payload, entity),
                    Nothing: () => !isNil(pObq(payload)) ? Just([pObq(payload)]) : Nothing()
                })
            };
        }
        case SHOW_CATEGORY: {

            return {
                ...state,
                categories: state.categories.cata({
                    Just: () => !isNil(pValue(payload)) ? checkAllCategorySelectEmpty(payload) : Nothing(),
                    Nothing: () => !isNil(pValue(payload)) ? Just(pValue(payload)) : Nothing()
                })
            };
        }
        case SHOW_GOFUNDIS: {

            return {
                ...state,
                goFundis: state.goFundis.cata({
                    Just: entity => (pValue(payload)) ?
                        checkAllGoFundis(payload, entity) :
                        filterGoFundis(payload, entity),
                    Nothing: () => !isNil(pType(payload)) ? Just([pType(payload)]) : Nothing()
                })
            };
        }
        default: {
            return state;
        }
    }
}
