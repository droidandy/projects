import { createActions } from 'utils/reducer'

export const NAMESPACE = 'containers.BoAssignment'

const createAction = createActions(NAMESPACE)

export const TYPES = createAction.TYPES

export const initialize = createAction('initialize')
export const loadAssignment = createAction('loadAssignment')
export const loadAssignmentSuccess = createAction('loadAssignmentSuccess')
export const loadAssignmentFail = createAction('loadAssignmentFail')

export const checkInAssignment = createAction('checkInAssignment')
export const identifyAssignment = createAction('identifyAssignment')
export const updateSuccess = createAction('updateSuccess')

export const loadAgents = createAction('loadAgents')
export const loadAgentsSuccess = createAction('loadAgentsSuccess')
export const loadAgentsFail = createAction('loadAgentsFail')
export const updateAgentSuccess = createAction('updateAgentSuccess')

export const assignUser = createAction('assignUser')
export const assignUserFail = createAction('assignUserFail')
