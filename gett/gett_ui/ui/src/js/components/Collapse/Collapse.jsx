import React, { Children, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Collapse as AntCollapse } from 'antd';
import { includes } from 'lodash';
import { Icon } from 'components';
import CN from 'classnames';
import css from './collapse.css';

const Panel = AntCollapse.Panel;

export default class Collapse extends PureComponent {

  static propTypes = {
    defaultActiveKey: PropTypes.array,
    onChange: PropTypes.func,
    children: PropTypes.node,
    showSuffix: PropTypes.string
  };

  static defaultProps = {
    showSuffix: ''
  }

  state = {
    key: []
  };

  onChange = (key) => {
    const { onChange } = this.props;

    if (onChange) onChange(key);

    this.setState({ key });
  };

  renderHeader(title, index) {
    const { showSuffix } = this.props;
    const { key } = this.state;
    const active = includes(key,  `${index}/.${index}`);

    return (
      <div className="flex layout horizontal wrap">
        <div className="flex text-16 black-text light-text">
          { title }
        </div>
        <div className="text-14 blue-text bold-text">
          { active ? `Hide ${showSuffix}` : `Show ${showSuffix}` }
          <Icon className={ CN('text-22 ml-20', active ? css.show : css.hide) } icon="MdKeyboardArrowDown" />
        </div>
      </div>
    );
  }

  render() {
    const {children, defaultActiveKey} = this.props;

    return (
      <AntCollapse
        defaultActiveKey={ defaultActiveKey || ['1'] }
        onChange={ this.onChange }
        bordered={ false }
      >
        {
          Children.map(children, (child, index) => (
            <Panel
              key={ index }
              header={ this.renderHeader(child.props.title, index) }
              showArrow={ false }
            >
              { React.cloneElement(child) }
            </Panel>
          ))
        }
      </AntCollapse>
    );
  }
}
