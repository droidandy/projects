import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

const ListRowReverse = props => (
    <div styleName="list_row_reverse" style={{marginTop: 5, marginBottom: 5}}>
        {
            props.rightItem ?
                <div
                    styleName="list_item_number"
                    style={props.styleRightItem ? props.styleRightItem : null}
                >
                    {props.rightItem}
                </div> : null
        }
        <div styleName="list_columnItemStart">
            {
                props.item ?
                    <div styleName="list_column_item">{props.item}</div> : null
            }
            {
                props.subItem ?
                    <div styleName="list_column_itemSmall">{props.subItem}</div> : null
            }

        </div>
    </div>
);

ListRowReverse.propTypes = {
    styleRightItem: React.PropTypes.object,
    rightItem: PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    item: PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string
    ]),
    subItem: PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string
    ])
};

export default CSSModules(ListRowReverse, styles);
