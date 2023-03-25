import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import GoFundisPanel from 'components/GoFundis/Map/GoFundisPanel';
import GoogleMapSegment from 'components/GoogleMap';
import Placeholder from 'components/Placeholder';
import {
    filterGoFundis
} from 'utils';

function GoFundisMap(props) {
    return (
        <div>
            <GoFundisPanel
                value={props.value}
                onChange={props.onChangeStatus}
            />
            {props.data.errors.cata({
                Nothing: () => props.data.results.cata({
                    Nothing: () => (
                        <Placeholder busy={props.data.busy} size={[ '100%', '300px' ]} />
                    ),
                    Just: () => (
                        <GoogleMapSegment
                            mapSettings={props.mapSettings}
                            data={props.data.results.getOrElse([])}
                            filterData={filterGoFundis(props.value)}
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

GoFundisMap.propTypes = {
    mapSettings: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,

    onChangeStatus: PropTypes.func.isRequired
};

export default CSSModules(GoFundisMap, styles);
