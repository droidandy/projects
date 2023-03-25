import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import GoogleMapSegment from 'components/GoogleMap';
import Placeholder from 'components/Placeholder';
import {
    filterCommon
} from 'utils';

function SubscribersMap(props) {
    return (
        <div styleName='container-map'>
            {props.data.errors.cata({
                Nothing: () => props.data.results.cata({
                    Nothing: () => (
                        <Placeholder busy={props.data.busy} size={[ '100%', '300px' ]} />
                    ),
                    Just: () => (
                        <GoogleMapSegment
                            mapSettings={props.mapSettings}
                            data={props.data.results.getOrElse([])}
                            filterData={filterCommon}
                        />
                    )
                }),
                Just: errors => (
                    <div>{errors}</div>
                )
            })}

        </div>
    );
}

SubscribersMap.propTypes = {
    mapSettings: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
};

export default CSSModules(SubscribersMap, styles);

