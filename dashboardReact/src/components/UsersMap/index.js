import React, { PropTypes } from 'react';
import GoogleMapSegment from 'components/GoogleMap';
import Placeholder from 'components/Placeholder';
import UserPanel from 'components/UserPanel';
import {
    filterUser
} from 'utils';

function UsersMap(props) {
    return (
        <div>
            <UserPanel
                value={props.value}
                onChange={props.onChange}
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
                            filterData={filterUser(props.value)}
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

UsersMap.propTypes = {
    mapSettings: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default UsersMap;

