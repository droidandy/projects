import { createActions } from 'utils/reducer'

export const NAMESPACE = 'containers.Profile'

const createAction = createActions(NAMESPACE)

export const TYPES = createAction.TYPES
export const initialize = createAction('initialize')
export const loadStats = createAction('loadStats')
export const loadStatsSuccess = createAction('loadStatsSuccess')
export const loadRating = createAction('loadRating')
export const loadRatingSuccess = createAction('loadRatingSuccess')
export const updateUser = createAction('updateUser')
export const updateUserSuccess = createAction('updateUserSuccess')
export const updateFail = createAction('updateFail')
export const updateAvatar = createAction('updateAvatar')
export const updateAvatarSuccess = createAction('updateAvatarSuccess')
export const updateAvatarFail = createAction('updateAvatarFail')
export const loadDistance = createAction('loadDistance')
export const loadDistanceSuccess = createAction('loadDistanceSuccess')
