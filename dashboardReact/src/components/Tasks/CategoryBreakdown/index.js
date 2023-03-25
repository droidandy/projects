import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import {
    isArray
} from 'lodash/fp';
import CategoryItem from 'components/Tasks/CategoryBreakdown/CategoryItem';
import Placeholder from 'components/Placeholder';

function TasksCategoryBreakdown(props) {
    return (
        <div >
            {props.data.errors.cata({
                Nothing: () => props.data.results.cata({
                    Nothing: () => (
                        <Placeholder busy={props.data.busy} size={[ '100%', '332px' ]} />
                    ),
                    Just: fields => (
                        <div styleName='wrapper-categories'>
                            <div styleName="returning_subscribers" >
                                <div styleName="reparate_item_col">
                                    <div styleName="small_text_panel">REPORTED</div>
                                    <div styleName="small_text_panel">COMPLETED</div>
                                </div>
                                {isArray(fields) ? fields.map((field, index) => (
                                    <CategoryItem key={index} {...field} />
                                )) : null}
                            </div>
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

TasksCategoryBreakdown.propTypes = {
    data: PropTypes.object.isRequired
};

export default CSSModules(TasksCategoryBreakdown, styles);
