import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import Highchart from 'react-highcharts/ReactHighcharts';
import {
    merge
} from 'lodash/fp';
import {
    SUBSCRIBERS_SHARE_PER_AREA
} from 'models/highchartConfig';
import Placeholder from 'components/Placeholder';

function SubscribersSharePerArea(props) {
    return (
        <div>
            <div styleName='sub_container_header'>SUBSCRIBERS SHARE PER AREA</div>
            {props.data.errors.cata({
                Nothing: () => props.data.results.cata({
                    Nothing: () => (
                        <Placeholder busy={props.data.busy} size={[ '100%', '200px' ]} />
                    ),
                    Just: fields => (
                        <div styleName="list_column_highcharts">
                            <Highchart config={merge(fields ? fields : {}, SUBSCRIBERS_SHARE_PER_AREA)} />
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

SubscribersSharePerArea.propTypes = {
    data: PropTypes.object.isRequired
};

export default CSSModules(SubscribersSharePerArea, styles);
