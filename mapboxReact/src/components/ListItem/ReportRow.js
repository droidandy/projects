import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import FIcon from 'react-fontawesome';

const ReportRow = props => (

    <div styleName="report_row"
         style={props.style ? props.style : null}>
        <div styleName="report_left"
            style={props.styleChildren ? props.styleChildren : null}>
            {
                props.children ? props.children :
                    <FIcon
                        size={'2x'}
                        name={'user-circle'}
                        styleName='inline_items'
                        style={{color: '#ffffff'}}
                    />
            }
        </div>
        <div styleName='report_block'
             style={props.styleReportBlock ? props.styleReportBlock : null}>
            {
                props.upItem ?
                    <div
                        styleName="list_item_number_center"
                        style={props.styleUpItem ? props.styleUpItem : null}
                    >
                        {props.upItem}
                    </div> : null
            }
            <div styleName="report_columnItemStart">
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
    </div>
);

ReportRow.propTypes = {
    styleChildren: React.PropTypes.object,
    children: PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.array,
        React.PropTypes.object
    ]),
    style: React.PropTypes.object,
    styleReportBlock: React.PropTypes.object,
    styleUpItem: React.PropTypes.object,
    upItem: PropTypes.oneOfType([
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

export default CSSModules(ReportRow, styles);
