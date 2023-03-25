import React, { Component } from 'react';
import classNames from 'classnames';
import Aux from '../../hoc/Aux';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

class CustomMultiSelect extends Component {
  constructor(props) {
    super(props);

    this.state.values = this.props.values;
  }

  state = {
    open: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.open !== this.state.open) {
      this.setState({ ...this.state, values: this.props.values });
    }
  }

  setPosition = () => {
    var rect = this.refs.customselect.getBoundingClientRect();
    var rectmenu = this.refs.menu.getBoundingClientRect();
    this.setState({
      left: rect.x - rectmenu.width / 2 + rect.width / 2,
      top: rect.y + rect.height,
    });
  };

  getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth;
  };

  toggleOpen = () => {
    this.setState({ open: !this.state.open }, () => {
      if (this.state.open) {
        this.setPosition();
        document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.paddingRight = '0px';
        document.body.style.overflow = '';
      }
    });
  };

  onIconError = (e) => {
    e.target.style.display = 'none';
  };

  itemClasses = (option) => {
    return classNames('custom-select__outer-menu__item', {
      'custom-select__outer-menu__item_active': this.state.values.some(
        (value) => value === option[this.props.valueKey]
      ),
    });
  };

  selectClassNames = () => {
    const { open } = this.state;
    const { className } = this.props;

    return classNames(`custom-select ${className || ''}`, {
      'custom-select_open': open,
    });
  };

  handleClickOnOption = (option) => {
    if (this.state.values.includes(option.value)) {
      this.setState((prevState) => ({
        ...prevState,
        values: prevState.values.filter((value) => value !== option.value),
      }));
    } else {
      this.setState({
        ...this.state,
        values: [...this.state.values, option.value],
      });
    }
  };

  handleOnSave = () => {
    this.props.onChange(this.state.values);
    this.toggleOpen();
  };

  renderValues = () => {
    const {options, values} = this.props;

    return values.map(value => {
      const currentOption = options.find(option => option.value === value);
      if(currentOption) {
        return currentOption.name
      }
    }).join(', ')
  }

  render() {
    const {
      options,
      labelKey,
      id,
    } = this.props;
    const { open } = this.state;
    return (
      <div ref="customselect" className={this.selectClassNames()} id={id}>
        <div className="custom-select__inner" onClick={this.toggleOpen}>
          <div className="custom-select__value">{this.renderValues()}</div>
          <div className="custom-select__arrow">
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.41 0.59L6 5.17L10.59 0.59L12 2L6 8L0 2L1.41 0.59Z"
                fill="#0085FF"
              />
            </svg>
          </div>
        </div>
        {open && (
          <Aux>
            <div className="custom-select__overlay" onClick={this.toggleOpen} />
            <div
              ref="menu"
              className="custom-select__outer"
              style={{ left: this.state.left, top: this.state.top }}
            >
              <div className="custom-select__outer-menu">
                <SimpleBar
                  style={{ maxHeight: 260 }}
                  forceVisible="y"
                  autoHide={false}
                >
                  {this.props.title && (
                    <div className="custom-select__outer-title">
                      {this.props.title}
                    </div>
                  )}
                  {options.map((option, index) => (
                    <div
                      className={this.itemClasses(option)}
                      key={index}
                      onClick={() => {
                        this.handleClickOnOption(option);
                      }}
                    >
                      {this.props.withIcons && (
                        <span className="custom-select__outer-menu__item-icon">
                          <img
                            src={option.icon_url}
                            onError={this.onIconError}
                          />
                        </span>
                      )}
                      {this.props.subscriptions ? (
                        <span className="custom-select__outer-menu__item-label">
                          {option.product_group_name}
                        </span>
                      ) : (
                        <span className="custom-select__outer-menu__item-label">
                          {option[labelKey]}
                        </span>
                      )}
                    </div>
                  ))}
                  <div className="custom-select__button-zone">
                    <button
                      className="button_green button button_stretch"
                      onClick={this.handleOnSave}
                    >
                      Save
                    </button>
                  </div>
                </SimpleBar>
              </div>
            </div>
          </Aux>
        )}
      </div>
    );
  }
}

export default CustomMultiSelect;
