import React, { PropTypes } from 'react';
import {
    FormGroup,
    ControlLabel
} from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import {
    T
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';


export default function IntervalPicker(props) {
    return (
        <FormGroup>
            <ControlLabel>
                {props.children}
            </ControlLabel>

            <DatePicker
                value={props.value.getOrElse('')}
                showClearButton={props.value.map(T).getOrElse(false)}
                disabled={props.disabled}
                onChange={props.onChange}
            />
        </FormGroup>
    );
}

IntervalPicker.propTypes = {
    value: PropTypes_.Maybe(
        PropTypes.string.isRequired
    ).isRequired,
    disabled: PropTypes.bool.isRequired,
    children: PropTypes.string.isRequired,

    onChange: PropTypes.func.isRequired
};
