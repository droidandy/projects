import React from 'react'
import moment from 'moment'

const defaultFormat = 'DD-MM-YYYY'

const Date = ({ value, format }) => (
  <span>{ moment.utc(value).format(format || defaultFormat) }</span>
)

export default Date
