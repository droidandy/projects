import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import {
    map,
    size,
    isArray
} from 'lodash/fp';
import {
    capitalize
} from 'utils';

function HeaderCategory(props) {
    return (
        <div styleName='header_category'>
            <div styleName='header_category_label'>Category</div>
            <div styleName='header_category_subLabel_status'>
                {props.data.cata({
                    Nothing: () => (<span>&nbsp;</span>),
                    Just: fields => (
                        (isArray(fields) && size(fields)) ?
                            map(field => (
                                <span styleName='header_category_element' key={field.value}>
                                    {capitalize(field.label)}
                                </span>), fields) :
                                (<span styleName='header_category_element_none'>Select a category</span>)
                    )
                })}
            </div>
        </div>
    );
}

HeaderCategory.propTypes = {
    data: PropTypes.object.isRequired
};

export default CSSModules(HeaderCategory, styles);
