function checkRange(dayMoment, range) {
  return (
    dayMoment.isBetween(range['startDate'], range['endDate']) ||
    dayMoment.isBetween(range['endDate'], range['startDate'])
  )
}

function checkStartEdge(dayMoment, range) {
  const { startDate } = range

  return dayMoment.startOf('day').isSame(startDate.startOf('day'))
}

function checkEndEdge(dayMoment, range) {
  const { endDate } = range

  return dayMoment.endOf('day').isSame(endDate.endOf('day'))
}

export {
  checkRange,
  checkStartEdge,
  checkEndEdge
}
