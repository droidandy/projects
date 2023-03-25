import React, { Children, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Select as AntSelect, Spin } from 'antd';
import { Icon } from 'components';
import { castArray, compact, without, union, noop } from 'lodash';
import { strFilter } from 'utils';
import CN from 'classnames';
import css from './Select.css';

const Option = AntSelect.Option;
const excludedKeys = ['select-all', 'deselect-all'];

export default class Select extends PureComponent {
  static propTypes = {
    error: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    labelClassName: PropTypes.string,
    mode: PropTypes.string,
    selectAll: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array
    ]),
    showSearch: PropTypes.bool,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    onFocus: PropTypes.func,
    loading: PropTypes.bool,
    unblockedLoading: PropTypes.bool,
    icon: PropTypes.string,
    iconText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    iconClassName: PropTypes.string,
    children: PropTypes.node,
    optionFilterProp: PropTypes.string,
    containerId: PropTypes.string,
    name: PropTypes.string,
    dataName: PropTypes.string
  };

  static defaultProps = {
    optionFilterProp: 'children',
    loading: false,
    unblockedLoading: false,
    containerId: 'scrollContainer',
    selectAll: true,
    onFocus: noop
  };

  state = {
    filterValue: ''
  };

  // TODO: resolve issues with 'react/sort-comp' linter rule and place before lifecycle definitions
  static Option = Option;
  static caseInsensitiveFilter = (val, opt) => opt.props.children.toLowerCase().includes(val.toLowerCase());

  getInput() {
    // eslint-disable-next-line react/no-find-dom-node
    return ReactDOM.findDOMNode(this.select).querySelector('input');
  }

  getElementWithSelectedValue() {
    // eslint-disable-next-line react/no-find-dom-node
    return ReactDOM.findDOMNode(this.select).querySelector('.ant-select-selection-selected-value');
  }

  onChange = (value) => {
    if (this.suppressOnChange) {
      this.suppressOnChange = false;
      return;
    }

    let nextValue = value;
    if (value === undefined) {
      nextValue = '';
    } else if (value.includes('select-all')) {
      nextValue = union(without(nextValue, 'select-all'), this.getAllFilteredItems());
    } else if (value.includes('deselect-all')) {
      nextValue = [];
    }
    this.props.onChange(nextValue);
    this.setState({ filterValue: '' });
  };

  onSelect = (value) => {
    const { showSearch, onChange, onSelect } = this.props;

    if (showSearch) {
      if (onSelect) {
        this.suppressOnChange = true;
        onSelect(value);
      } else {
        onChange(value);
      }
    }
  };

  onFocus = () => {
    const { showSearch, onFocus } = this.props;

    onFocus();
    if (showSearch) {
      const selectedValue = this.getElementWithSelectedValue();
      this.getInput().value = selectedValue ? selectedValue.title : '';
    }
  };

  setInnerState(state) {
    this.select.setState(state);
  }

  selectRef = select => this.select = select;

  getAllFilteredItems() {
    return compact(Children.map(this.props.children, child => this.filter(child, this.state.filterValue) ? child.props.value || child.key : null));
  }

  filterOption = (inputValue, option) => {
    this.setState({ filterValue: inputValue });
    return excludedKeys.includes(option.key) || this.filter(option, inputValue);
  };

  filter = (option, filter) => {
    return strFilter(option.props[this.props.optionFilterProp], filter);
  };

  getPopupContainer = () => {
    return document.querySelector(`#${this.props.containerId}`);
  };

  renderClearIcon = () => <Icon className={ css.clearIcon } icon="SelectClear" />;

  render() {
    // eslint-disable-next-line no-unused-vars
    const { value, mode, error, className, label, labelClassName, loading, unblockedLoading, icon, iconText, children, iconClassName, containerId, selectAll, dataName, ...rest } = this.props;
    let inputValue = value;

    if (value && mode === 'multiple') {
      inputValue = castArray(value).map(val => val.toString());
    } else if (value !== undefined && value !== null) {
      inputValue = value.toString();
    }

    rest.onChange = this.onChange;
    if (rest.showSearch) {
      rest.onSearch = rest.onChange;
    }

    // Filter out falsy children from options. Since children have to be processed in any way, they receive new keys.
    // This forces to copy original `key` value as `value` prop so it can be used as correct value in handlers.
    // And since we have to use `Children.map`, we don't actually need additional filters since `map` won't add `null`
    // values to the resulting array internally.
    const items = Children.map(children, child => child ? (child.props.value === undefined ? React.cloneElement(child, { value: child.key }) : child) : null);

    if (mode === 'multiple') {
      if (selectAll) {
        items.unshift(
          <Option value="select-all" key="select-all" className={ `${css.btn} layout horizontal inline blue-text p-5 pl-15` }>Select All</Option>,
          <Option value="deselect-all" key="deselect-all" className={ `${css.btn} layout horizontal inline blue-text p-5` }>Deselect All</Option>
        );
      }

      rest.filterOption = this.filterOption;
    }

    const select = (
      <AntSelect
        ref={ this.selectRef }
        key="select"
        mode={ mode }
        value={ inputValue }
        className={ `block ${css.select}` }
        getPopupContainer={ this.getPopupContainer }
        optionLabelProp="children"
        { ...rest }
        onSelect={ this.onSelect }
        clearIcon={ this.renderClearIcon() }
        onFocus={ this.onFocus }
      >
        { items }
      </AntSelect>
    );

    return (
      <div data-name={ dataName || rest.name } className={ CN(className, { 'with-icon relative': icon }) }>
        { label &&
          <label className={ CN(labelClassName, 'text-12 dark-grey-text bold-text') }>{ label }</label>
        }
        <div className="relative layout horizontal center">
          { icon &&
            <Icon className={ CN(iconClassName, 'text-22 medium-grey-text icon') } icon={ icon } svgProps={ { iconText } } />
          }
          { unblockedLoading
            ? [select, <Spin key="spinner" className={ css.spinner } spinning={ loading } />]
            : <Spin wrapperClassName="block" spinning={ loading }>{ select }</Spin>
          }
        </div>
        { error &&
          <div className="error">{ error }</div>
        }
      </div>
    );
  }
}
