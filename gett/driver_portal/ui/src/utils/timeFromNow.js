import moment from 'moment'

export default time => {
  return moment.duration(
    moment().utc().diff(time)
  ).humanize()
}
