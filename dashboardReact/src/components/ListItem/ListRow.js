import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

const ListRow = props => (
    <div styleName="list_row" style={props.style ? props.style : null}>
        {
            props.leftItem ?
                <div
                    styleName="list_item_numberMargin"
                    style={props.styleLeftItem ? props.styleLeftItem : null}
                >
                    {props.leftItem}
                </div> : null
        }
        <div styleName="list_columnItem">
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

ListRow.propTypes = {
    style: React.PropTypes.object,
    styleLeftItem: React.PropTypes.object,
    leftItem: PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    item: PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    subItem: PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string
    ])
};

export default CSSModules(ListRow, styles);
