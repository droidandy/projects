import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Radio, Dropdown, Icon, Button, Checkbox, Table, TextArea } from 'semantic-ui-react';
import { Dropzone } from '@benrevo/benrevo-react-core';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import * as types from '../../types'
import { checkDisabled } from '../../utils'

class OnBoardingField extends React.Component  {
  static propTypes = {
    itemKey: PropTypes.string,
    answers: PropTypes.object,
    answer: PropTypes.object,
    index: PropTypes.number,
    item: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    changeField: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.changeField = this.changeField.bind(this);
    this.changeCount = this.changeCount.bind(this);
    this.changeCheckbox = this.changeCheckbox.bind(this);
  }

  componentWillMount() {
    const { item, answers, itemKey } = this.props;
    let answer = this.props.answer;
    if (item.type === types.RADIO) {
      if (!answer) {
        answer = item.defaultItem || 'No';
        this.props.changeField({ key: this.props.itemKey, type: item.type }, answer);
      }
    } else if (item.type === types.SELECT) {
      if (!answer && item.defaultItem) {
        answer = item.defaultItem;
        this.props.changeField({ key: this.props.itemKey, type: item.type }, answer);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { item, answers, itemKey } = this.props;

    if (item.type === types.CHECKBOX && item.unique && item.parent) {
      const count = answers[item.parent];
      const currentAnswer = answers[itemKey];

      if (count && prevProps.answers[item.parent].value !== count.value ) {
        for (let i = 0; i < count.value; i += 1) {
          const key = `${item.key}${i + 1}`;
          const answer = answers[key];

          if (answer && answer.values) {
            for (let j = 0; j < answer.values.length; j += 1) {
              if (currentAnswer && currentAnswer.values && key !== itemKey) {
                for (let l = 0; l < currentAnswer.values.length; l += 1) {
                  if (currentAnswer.values[l] === answer.values[j]) {
                    this.changeCheckbox(answer.values[j], false, key, answer);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  changeCount(type) {
    let value = (this.props.answer) ? parseInt(this.props.answer.value) : 0;

    if (type === 'PLUS') value += 1;
    else if (value !== 0) value -= 1;

    this.props.changeField({ key: this.props.itemKey, type: this.props.item.type }, value);
  }

  changeCheckbox(listItem, checked, key = this.props.itemKey, answer = this.props.answer) {
    let values = (answer && answer.values) ? answer.values : [];

    if (!checked) {
      values.map((item, i) => {
        if (item === listItem) {
          values.splice(i, 1);
          return true;
        }

        return true;
      });
    } else {
      values.push(listItem);
    }

    this.props.changeField({ key, type: this.props.item.type }, undefined, values);
  }

  changeField(item, value, key = this.props.itemKey) {
    this.props.changeField({ key, type: item.type, limit: item.limit }, value);
  }

  render() {
    const { item, answers, itemKey } = this.props;
    let answer = (this.props.item.type === types.CHECKBOX) ? [] : '';
    if (this.props.answer) {
      if (this.props.answer.value) answer = this.props.answer.value;
      else if (this.props.answer.values) answer = this.props.answer.values;
    }

    if (item.type === types.INTEGER ||
      item.type === types.STRING ||
      item.type === types.EMAIL ||
      item.type === types.PHONE ||
      item.type === types.FLOAT) {
      return (
        <Input
          name={itemKey}
          placeholder={item.placeholder}
          value={answer}
          onChange={(e, inputState) => { this.changeField(item, inputState.value); }}
        />
      )
    } else if (item.type === types.TEXTAREA) {
      return (
        <Form>
          <Form.TextArea
            name={itemKey}
            value={answer}
            onChange={(e, inputState) => { this.changeField(item, inputState.value); }}
          />
        </Form>
      )
    } else if (item.type === types.RADIO) {
      return (
        <Form>
          {item.list.map((listItem, i) => {
            return (
              <Form.Field key={i}>
                <Radio
                  label={listItem}
                  value={listItem}
                  checked={answer === listItem}
                  onChange={(e, inputState) => { this.changeField(item, inputState.value); }}
                />
              </Form.Field>
            )
          })}
        </Form>
      )
    } else if (item.type === types.RADIO_MASSIVE) {
      return (
        <Form>
          {item.children.map((listItem, i) => {
            let radioAnswer = (answers[listItem.key] && answers[listItem.key].value) ? answers[listItem.key].value : '';
            return (
              <Form.Group inline key={i}>
                <span className="radio-massive-label">{listItem.title}</span>
                <Form.Radio label='Yes' value='Yes' checked={radioAnswer === 'Yes'} onChange={(e, inputState) => { this.changeField(listItem, inputState.value, listItem.key); }} />
                <Form.Radio label='No' value='No' checked={radioAnswer === 'No'} onChange={(e, inputState) => { this.changeField(listItem, inputState.value, listItem.key); }} />
              </Form.Group>
            )
          })}
        </Form>
      )
    } else if (item.type === types.SELECT) {
      const options = item.list.map((item, i) => ({
        key: i,
        value: item,
        text: item,
      }));
      return (
        <Dropdown
          search
          selection
          options={options}
          value={answer}
          name={itemKey}
          onChange={ (e, inputState) => { this.changeField(item, inputState.value); }} />
      )
    } else if (item.type === types.COUNT) {
      return (
        <div className="count-control">
          <Button disabled={answer >= item.max} onClick={() => { this.changeCount('PLUS'); }} icon size="medium"><Icon name='plus' /></Button>
          <span className="indicator big">{ answer || 0 }</span>
          <Button disabled={!answer || +answer === (item.min || 0)} onClick={() => { this.changeCount('MINUS'); }} icon size="medium"><Icon name='minus' /></Button>
        </div>
      )
    } else if (item.type === types.CHECKBOX) {
      return (
        <Form className={item.unique ? 'columns' : ''}>
          {item.list.map((listItem, i) => {
            let checked = false;

            for (let j = 0; j < answer.length; j++) {
              if (answer[j] === listItem) {
                checked = true;
                break;
              }
            }

            return (
              <Form.Field key={i}>
                <Checkbox name={`${itemKey}_${i}`} disabled={item.unique ? checkDisabled(listItem, item, answers, itemKey) : false} label={listItem} checked={checked} onChange={ (e, inputState) => { this.changeCheckbox(listItem, inputState.checked); }}/>
              </Form.Field>
            )
          })}
        </Form>
      )
    } else if (item.type === types.DATE) {
      return (
        <DatePicker className="datepicker" name={itemKey}
                    selected={(answer) ? moment(answer, ['L']) : null}
                    onChange={(date) => { this.changeField(item, (date) ? moment(date).format('L') : ''); }} />
      )
    } else if (item.type === types.FILE) {
      return (
        <Dropzone
          name="onBoardingFiles"
          accept="pdf, xlsx, docx" files={[]} maxSize={5242880}
          onRemove={(index) => {}}
          onDrop={(files) => {}}
        />
      )
    } else if (item.type === types.TABLE) {
      return (
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              {item.rows[0].columns.map((column, j) => {
                return (
                  <Table.HeaderCell key={j}>
                    <span>{column.value}</span>
                  </Table.HeaderCell>
                )
              })}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {item.rows.map((row, i) => {
              if (i > 0) {
                return (
                  <Table.Row key={i}>
                    {row.columns.map((column, j) => {
                      return (
                        <Table.Cell key={j} textAlign={column.type === types.TABLE_RADIO ? 'center' : 'left'}>
                          { column.type === types.TABLE_TEXT && <span>{column.value}</span> }
                          { column.type === types.TABLE_RADIO &&
                          <Radio
                            value={column.value}
                            checked={answers[column.key] && answers[column.key].value === column.value}
                            onChange={(e, inputState) => { this.changeField(item, inputState.value, column.key); }}
                          />
                          }
                        </Table.Cell>
                      )
                    })}
                  </Table.Row>
                )
              }
            })}
          </Table.Body>
        </Table>
      )
    }
    return (
      <span>test2</span>
    )
  }
}


export default OnBoardingField;
