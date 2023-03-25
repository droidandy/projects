import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import { mapValues, isEqual } from 'lodash';
import css from './TextEditor.css';

const colors = {
  'main': '#595959',
  'red': '#eb2e2e',
  'blue': '#0076bb',
  'green': '#489a3e',
  'yellow': '#ffb71a'
};

const styleMap = mapValues(colors, c => ({ color: c }));
const styleOptions = {
  inlineStyles: {
    ...mapValues(colors, c => ({ style: { color: c } })),
    'CODE': { style: { backgroundColor: '#f3f3f3', fontSize: 16, padding: 2 } }
  }
};

export default class Editor extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string
  };

  state = {
    value: RichTextEditor.createEmptyValue(),
    color: 'main',
    valueInitialized: false
  };

  static getDerivedStateFromProps(props, state) {
    const { value } = props;
    const { valueInitialized, prevValue } = state;
    if (!valueInitialized && !isEqual(value, prevValue)) {
      return {
        prevValue: value,
        value: RichTextEditor.createValueFromString(value, 'html'),
        valueInitialized: true
      };
    }
    return null;
  }

  onChange = (value) => {
    // TODO: get rid of double html conversion. it may be worth to store htmlValue
    // alongside with value in state.
    const oldHtml = this.state.value.toString('html', styleOptions);
    const newHtml = value.toString('html', styleOptions);

    this.setState({ value });

    if (newHtml !== oldHtml) this.props.onChange(newHtml);
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { className, onChange, value, ...rest } = this.props;

    return (
      <div className={ className }>
        <RichTextEditor
          className={ `rte-container ${css.rte}` }
          value={ this.state.value }
          onChange={ this.onChange }
          customStyleMap={ styleMap }
        />
      </div>
    );
  }
}
