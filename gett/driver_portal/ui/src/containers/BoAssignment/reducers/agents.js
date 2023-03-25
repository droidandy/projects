import unionBy from 'lodash/unionBy'

export const loadAgents = (state) => ({
  ...state,
  agents: {
    ...state.agents,
    loading: true
  }
})

export const loadAgentsSuccess = (state, { users, channels }) => ({
  ...state,
  agents: {
    ...state.agents,
    users,
    channels,
    loading: false
  }
})

export const loadAgentsFail = (state, { errors }) => ({
  ...state,
  agents: {
    ...state.agents,
    errors,
    loading: false
  }
})

export const updateAgentSuccess = (state, { data }) => {
  const newAssignment = unionBy([data], state.agents.users, 'id')
  return {
    ...state,
    agents: {
      ...state.assignment,
      users: newAssignment,
      loading: false
    }
  }
}
