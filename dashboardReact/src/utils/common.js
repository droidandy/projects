import {
    TASK_STATYS_ALL,
    CATEGORY_ALL,
    USER_TYPE_ALL,
    GOFUNDIS_ALL
} from 'models/googlemap';
import {
    compose,
    filter,
    findIndex,
    isArray,
    curry,
    some,
    join,
    split,
    property
} from 'lodash/fp';

export const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase();
export const pValue = property('value');
export const pColor = property('color');
export const pTitle = property('title');
export const pSubtitle = property('subtitle');

export const pChildren = property('children');
export const pName = property('name');
export const pIcon = property('icon');
export const pType = property('type');
export const pLat = property('lat');
export const pLng = property('lng');

export const pSplitJoin = curry(
    (joinLetter, splitLetter) => compose(
        join(joinLetter),
        split(splitLetter)
    )
);
export const pNameStyleType = compose(
    pSplitJoin('-', ' '),
    pName
);
export const pNameValueType = compose(
    pSplitJoin('_', ' '),
    pName
);

export const pIconStyleType = compose(
    pSplitJoin('', '.svg'),
    pIcon
);

export const styleType = curry(
    (field, cat) => (
        `${pNameStyleType(field)}-${pIconStyleType(cat)}`
    )
);
export const valueType = curry(
    (field, cat) => (
        `${pNameValueType(field)}_${pIconStyleType(cat)}`
    )
);

export const labelType = curry(
    (field, cat) => (
        capitalize(`${pName(field)} ${pName(cat)}`)
    )
);
export const createMapOptions = curry(
    maps => (
        {
            scrollwheel: false,
            disableDefaultUI: true,
            zoomControl: true,
            zoomControlOptions: {
                position: maps.ControlPosition.RIGHT_BOTTOM,
                style: maps.ZoomControlStyle.SMALL
            },
            mapTypeControl: false
        }
    )
);

export const locationInScreen = curry(
    (location, nw, se) => (
        (pLat(nw) > pLat(location) && pLat(location) > pLat(se)) &&
        (pLng(nw) < pLng(location) && pLng(location) < pLng(se))
    )
);

export const filterUser = curry(
    (option, arr) => (
        isArray(arr) ? filter(item => (
            (!!~findIndex(optionItem => optionItem === USER_TYPE_ALL, option.getOrElse([]))) ||
            (
                some(someOption => (someOption === pType(item)), option.getOrElse([]))
            )
        ), arr) : (false)
    )

);
export const filterTask = curry(
    (option, arr) => (
        isArray(arr) ? filter(item => (
            (!!~findIndex(optionItem => optionItem === TASK_STATYS_ALL, option.getOrElse([]))) ||
            (
                some(someOption => (someOption === pType(item)), option.getOrElse([]))
            )
        ), arr) : (false)
    )

);

export const filterCategory = curry(
    (option, arr) => (
        isArray(arr) ? filter(item => (
            (!!~findIndex({
                value: CATEGORY_ALL,
                label: capitalize(CATEGORY_ALL)
            }, option.getOrElse([]))) ||
            (
                some(opt => (opt.value.toString().split('_').join('-') === pType(item)), option.getOrElse([]))
            )
        ), arr) : (false)
    )

);

export const filterGoFundis = curry(
    (option, arr) => (
        isArray(arr) ? filter(item => (
            (!!~findIndex(optionItem => optionItem === GOFUNDIS_ALL, option.getOrElse([]))) ||
            (
                some(someOption => (someOption === pType(item)), option.getOrElse([]))
            )
        ), arr) : (false)
    )

);

export const filterCommon = curry(
    arr => (
        isArray(arr) ? filter(() => (true), arr) : (false)
    )
);
