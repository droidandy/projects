import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import {
    isArray
} from 'lodash/fp';
import CategoryItem from 'components/Overview/CategoryStatistics/CategoryItem';
import Placeholder from 'components/Placeholder';

function OverviewCategoryStatistics(props) {
    return (
        <div>
            {props.data.errors.cata({
                Nothing: () => props.data.results.cata({
                    Nothing: () => (
                        <Placeholder busy={props.data.busy} size={[ '100%', '332px' ]} />
                    ),
                    Just: fields => (
                        <div styleName="returning_subscribers" style={{
                            flexWrap: 'wrap',
                            flexDirection: 'row'
                        }}>
                            {(fields.categoryGroups && isArray(fields.categoryGroups)) ?
                                fields.categoryGroups.map((field, index) => (
                                    <CategoryItem
                                        key={index}
                                        name={field.name}
                                        subCategories={field.children} />
                                )) : null}
                        </div>
                    )
                }),
                Just: errors => (
                    <div>{errors}</div>
                )
            })}
        </div>
    );
}

OverviewCategoryStatistics.propTypes = {
    data: PropTypes.object.isRequired
};

export default CSSModules(OverviewCategoryStatistics, styles);
