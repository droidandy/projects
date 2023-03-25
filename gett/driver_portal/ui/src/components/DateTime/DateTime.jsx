import React from 'react'
import moment from 'moment'

const defaultFormat = 'DD-MM-YYYY, HH:mm'

const DateTime = ({ value, format }) => (
  <span>{ moment.utc(value).format(format || defaultFormat) }</span>
)

export default DateTime
