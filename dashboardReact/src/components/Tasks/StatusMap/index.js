import React, { PropTypes } from 'react';
import Placeholder from 'components/Placeholder';
import GoogleMapSegment from 'components/GoogleMap';
import TaskPanel from 'components/Tasks/StatusMap/TaskPanel';
import {
    filterTask
} from 'utils';

function TasksStatusMap(props) {
    return (
        <div>
            <TaskPanel
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
                            filterData={filterTask(props.value)}
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

TasksStatusMap.propTypes = {
    mapSettings: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default TasksStatusMap;
