import React from 'react';
import {
    Button,
    Glyphicon
} from 'react-bootstrap';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';


class DateRangePickerItem extends React.Component {

    constructor(props) {
        super(props);
        this.handleEvent = this.handleEvent.bind(this);
        this.state = {
            ranges: {
                Today: [moment(), moment()],
                Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'),
                    moment().subtract(1, 'month').endOf('month')]
            },
            startDate: moment().subtract(29, 'days'),
            endDate: moment()
        };
    }
    handleEvent(event, picker) {
        this.setState({
            startDate: picker.startDate,
            endDate: picker.endDate
        });
    }
    render() {
        const start = this.state.startDate.format('YYYY-MM-DD');
        const end = this.state.endDate.format('YYYY-MM-DD');
        let label = `${start} - ${end}`;
        if (start === end) {
            label = start;
        }
        return (
            <div>
                <DateRangePicker
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    ranges={this.state.ranges}
                    onEvent={this.handleEvent}>
                    <Button className="selected-date-range-btn" style={{width: '100%'}}>
                        <div className="pull-left"><Glyphicon glyph="calendar" /></div>
                        <div className="pull-right">
									<span>
										{label}
									</span>
                            <span className="caret"></span>
                        </div>
                    </Button>
                </DateRangePicker>
            </div>
        );
    }
}
DateRangePickerItem.propTypes = {
};

export default DateRangePickerItem;
