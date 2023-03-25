import React, { PropTypes } from 'react';
import FIcon from 'react-fontawesome';
import CSSModules from 'react-css-modules';
import styles from '../__assets__/styles.css';
import {
    USER_TYPE_SUBSCRIBER,
    USER_TYPE_GOFUNDI,
    TASK_STATYS_UNASSIGNED,
    TASK_STATYS_ASSIGNED,
    TASK_STATYS_PERFORMED,
    TASK_STATYS_RATED,
    TASK_STATYS_COMPLETED,
    TASK_STATYS_CANCELLED,
    TASK_STATYS_SCHEDULED,
    CATEGORY_NEW_INSTALL_DECODER,
    CATEGORY_NEW_INSTALL_SIGNAL,
    CATEGORY_NEW_INSTALL_ERROR,
    CATEGORY_REPAIR_INSTALL_DECODER,
    CATEGORY_REPAIR_INSTALL_SIGNAL,
    CATEGORY_REPAIR_INSTALL_ERROR,
    GOFUNDIS_STATYS_OFFLINE,
    GOFUNDIS_STATYS_ONLINE,
    SUBSCRIBERS_ALL
} from 'models/googlemap';

function MapMark(props) {

    switch (props.type) {
        case GOFUNDIS_STATYS_OFFLINE:
            return (
                <div styleName="gofundis_offline_block">
                    <div styleName="user_inner" />
                </div>
            );
        case GOFUNDIS_STATYS_ONLINE:
            return (
                <div styleName="gofundis_online_block">
                    <div styleName="user_inner" />
                </div>
            );
        case USER_TYPE_SUBSCRIBER:
            return (
                <div styleName="subscribers_user_block">
                    <div styleName="user_inner" />
                </div>
            );
        case USER_TYPE_GOFUNDI:
            return (
                <div styleName="gofundis_user_block">
                    <div styleName="user_inner" />
                </div>
            );
        case TASK_STATYS_PERFORMED:
            return (
                <div styleName="subscribers_user_block" style={{backgroundColor: '#0B3B37'}}>
                    <div styleName="loading_inner" />
                </div>
            );
        case TASK_STATYS_COMPLETED:
            return (
                <div styleName="subscribers_user_block" style={{backgroundColor: '#07944A'}}>
                    <div styleName="check_inner" />
                </div>
            );
        case TASK_STATYS_ASSIGNED:
            return (
                <div styleName="subscribers_user_block" style={{backgroundColor: '#C21F50'}}>
                    <div styleName="loading_inner" />
                </div>
            );
        case TASK_STATYS_UNASSIGNED:
            return (
                <div styleName="subscribers_user_block" style={{backgroundColor: '#F47321'}}>
                    <div styleName="next_inner" />
                </div>
            );
        case TASK_STATYS_CANCELLED:
            return (
                <div styleName="subscribers_user_block" style={{backgroundColor: '#ED1C24'}}>
                    <div styleName="cancelled_inner" />
                </div>
            );
        case TASK_STATYS_SCHEDULED:
            return (
                <div styleName="subscribers_user_block" style={{backgroundColor: '#FFDE00'}}>
                    <div styleName="time_inner" />
                </div>
            );
        case TASK_STATYS_RATED:
            return (
                <div styleName="subscribers_user_block">
                    <div styleName="user_inner" />
                </div>
            );
        case CATEGORY_NEW_INSTALL_DECODER:
            return (<div styleName="new-installation-decoder" />);
        case CATEGORY_NEW_INSTALL_SIGNAL:
            return (<div styleName="new-installation-antenna" />);
        case CATEGORY_NEW_INSTALL_ERROR:
            return (<div styleName="new-installation-other" />);
        case CATEGORY_REPAIR_INSTALL_DECODER:
            return (<div styleName="repair-decoder" />);
        case CATEGORY_REPAIR_INSTALL_SIGNAL:
            return (<div styleName="repair-antenna" />);
        case CATEGORY_REPAIR_INSTALL_ERROR:
            return (<div styleName="repair-other" />);
        case SUBSCRIBERS_ALL:
            return (
                <div styleName="subscribers_block">
                    <div styleName="user_inner" />
                </div>
            );
        default:
            return (
                <FIcon
                    // styleName='google_map__pin'
                    size={'2x'}
                    name={'user-circle'}
                    // style={{color, borderBottomColor: color, display: 'block'}}
                    style={{color: 'blue'}}
                />
            );
    }
}
MapMark.propTypes = {
    type: PropTypes.string.isRequired
};
export default CSSModules(MapMark, styles);
