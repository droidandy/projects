import { findIndex } from 'lodash'

export const loadAssignment = (state) => ({
  ...state,
  assignment: {
    ...state.assignment,
    loading: true,
    last: false
  }
})

export const loadAssignmentSuccess = (state, { drivers, page, reset, last }) => {
  let newAssignment
  if (reset) newAssignment = drivers
  else newAssignment = [ ...state.assignment.drivers, ...drivers ]
  return {
    ...state,
    assignment: {
      ...state.assignment,
      drivers: newAssignment,
      page,
      last,
      loading: false
    }
  }
}

export const loadAssignmentFail = (state, { errors }) => ({
  ...state,
  assignment: {
    ...state.assignment,
    loading: false,
    last: false,
    errors
  }
})

export const updateSuccess = (state, { data, byIndex }) => {
  if (byIndex) {
    const findindex = findIndex(state.assignment.drivers, { [byIndex]: { id: data.id } })
    if (findindex > -1 && data.agentStatus === 'busy') {
      delete state.assignment.drivers[findindex].agent
    }
  } else {
    const index = findIndex(state.assignment.drivers, { id: data.id })
    state.assignment.drivers[index] = data
  }
  return {
    ...state,
    assignment: {
      ...state.assignment,
      loading: false
    }
  }
}
