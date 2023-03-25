import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import {
    isNull
} from 'lodash/fp';
import Placeholder from 'components/Placeholder';
import ReportRow from 'components/ListItem/ReportRow';

function OverviewTaskLiveStatistics(props) {
    return (
        <div styleName='container-payment'>
            {props.data.errors.cata({
                Nothing: () => props.data.results.cata({
                    Nothing: () => (
                        <Placeholder
                            style={{width: '100%', height: 84}}
                            busy={props.data.busy}
                            size={[ '100%', '100%' ]} />
                    ),
                    Just: fields => fields.map((field, index) => (
                        <ReportRow
                            key={index}
                            style={{margin: 5}}
                            styleUpItem={{
                                color: field.color && !isNull(field.color) ? field.color : '#F47323',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden'}}
                            styleReportBlock={{width: 125}}
                            upItem={
                                field.value &&
                                !isNull(field.value) ?
                                    field.value : '0'}
                            item={
                                field.title &&
                                !isNull(field.title) ?
                                    field.title : ''}
                        />
                    ))
                }),
                Just: errors => (
                    <div>{errors}</div>
                )
            })}
        </div>
    );
}

OverviewTaskLiveStatistics.propTypes = {
    data: PropTypes.object.isRequired
};

export default CSSModules(OverviewTaskLiveStatistics, styles);
