import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Image, Icon, Grid, Input } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { TimelineSuccess } from '@benrevo/benrevo-react-core';
import {
  PROJECT_TIME,
} from '../constants';

export class TableItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    item: PropTypes.object.isRequired,
    updateProjectTime: PropTypes.func.isRequired,
    updateCompleted: PropTypes.func.isRequired,
    admin: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.markAsComplete = this.markAsComplete.bind(this);
    this.onRawChangeDate = this.onRawChangeDate.bind(this);
    this.updateProjectTime = this.updateProjectTime.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.saveProjectTime = this.saveProjectTime.bind(this);
    this.state = {
      projectedTime: '',
    };
  }

  componentDidMount() {
    const { item } = this.props;
    this.setProjectedTime(moment(new Date(item.projectedTime)).format('MM-DD-YYYY'));
  }

  componentWillReceiveProps(nextProps) {
    const { item } = nextProps;
    this.setProjectedTime(moment(new Date(item.projectedTime)).format('MM-DD-YYYY'));
  }

  onRawChangeDate(item, event) {
    const date = event.target.value;
    this.setProjectedTime(date);
  }

  setProjectedTime(pTime) {
    this.setState({ projectedTime: pTime });
  }

  saveProjectTime(item) {
    const { projectedTime } = this.state;
    if (moment(projectedTime, 'MM/DD/YYYY').isValid()) {
      this.updateProjectTime(item, projectedTime);
      this._calendar.setOpen(false); // eslint-disable-line
      return;
    }
    this.setState({ projectedTime: '' });
  }

  updateProjectTime(item, date) {
    const timeLine = item;
    const timeLineId = item.timelineId;
    this.setState({ projectedTime: date }, () => {
      timeLine.projectedTime = moment(date, 'MM-DD-YYYY').format('YYYY-MM-DD'); // MM/DD/YY
      this.props.updateProjectTime(timeLineId, timeLine, this.props.parentIndex, this.props.childIndex);
    });
  }

  markAsComplete() {
    const { item } = this.props;
    this.props.updateCompleted(item);
  }

  render() {
    const { item, admin } = this.props;
    const { projectedTime } = this.state;
    const dateObj = new Date(item[PROJECT_TIME]);
    const momentObj = moment(dateObj);

    return (
      <Table.Row className={(item.selected) ? 'timelineBody row-selected' : 'timelineBody'}>
        <Table.Cell width="1">{item.refNum}</Table.Cell>
        <Table.Cell width="6"><strong>{item.milestone}</strong></Table.Cell>
        <Table.Cell width="3">{item.assignee}</Table.Cell>
        <Table.Cell width="2">
          <DatePicker
            {...this.props}
            ref={(c) => this._calendar = c} // eslint-disable-line
            className="datepicker timelineDatepicker"
            calendarClassName="timelineDatepickerBody"
            name={PROJECT_TIME}
            dateFormat="MM-DD-YYYY"
            placeholderText="Enter the effective date"
            selected={(item[PROJECT_TIME]) ? momentObj : null}
            onChange={(date) => { this.updateProjectTime(item, (date) ? moment(date).format('L') : ''); }}
            onChangeRaw={(event) => { this.onRawChangeDate(item, event); }}
            customInput={<TimelineCustomInput admin={admin} />}
          >
            <Grid className="calendarBlock">
              <Grid.Row>
                <Grid.Column width={16}>Projected completion</Grid.Column>
              </Grid.Row>
              <Grid.Row className="input noPaddedRow">
                <Grid.Column width={11}>
                  <Input
                    value={projectedTime}
                    onChange={(event) => { this.onRawChangeDate(item, event); }}
                  />
                </Grid.Column>
                <Grid.Column width={5}>
                  <Button
                    primary
                    size="small"
                    onClick={() => this.saveProjectTime(item)}
                  >
                    Save
                  </Button>
                </Grid.Column>
              </Grid.Row>
              <div className="closeBtn">
                <Button
                  onClick={() => this._calendar.setOpen(false)} // eslint-disable-line
                >
                  <div className="remove">X</div>
                </Button>
              </div>
            </Grid>
          </DatePicker>
        </Table.Cell>
        <Table.Cell width="4">
          <i>
            {admin && !item.completed &&
              <Button className="complete-button" size="medium" primary onClick={this.markAsComplete}>Mark as complete</Button>
            }
            {item.completed &&
            <Grid>
              <Grid.Row>
                <Grid.Column width={16} className="completedDate">
                  <Image src={TimelineSuccess} />
                  <div className="completed-time">Completed {moment(new Date(item.completedTime) || new Date()).format('MM-DD-YYYY')}</div>
                </Grid.Column>
              </Grid.Row>
            </Grid>}
            {!admin && !item.completed && <span>-</span>}
          </i>
        </Table.Cell>
      </Table.Row>
    );
  }
}

function TimelineCustomInput(props) {
  const { onClick, value, admin } = props;
  return (
    <div className="timelineDate">{value || 'set date'} { admin && <Icon name="pencil" onClick={onClick} />}</div>
  );
}

TimelineCustomInput.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.string,
  admin: PropTypes.bool,
  parentIndex: PropTypes.number,
  childIndex: PropTypes.number,
};

export default TableItem;
