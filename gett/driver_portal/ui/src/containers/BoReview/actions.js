import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.BoReview'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'approveReview',
  'approveReviewSuccess',
  'approveReviewFail',

  'rejectReview',
  'rejectReviewSuccess',
  'rejectReviewFail',

  'approveRequirement',
  'approveRequirementSuccess',
  'approveRequirementFail',

  'rejectRequirement',
  'rejectRequirementSuccess',
  'rejectRequirementFail',

  'updatePhoneContract',
  'updatePhoneContractSuccess',
  'updatePhoneContractFail',

  'showComplianceView',

  'loadHistory',
  'loadHistorySuccess',
  'loadHistoryFail',

  'loadStats',
  'loadStatsSuccess',
  'loadStatsFail'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const startReview = ({ userId }) => ({
  type: TYPES.startReview,
  userId
})

export const approveReview = ({ userId, history }) => ({
  type: TYPES.approveReview,
  userId,
  history
})

export const approveReviewSuccess = ({ review }) => ({
  type: TYPES.approveReviewSuccess,
  review
})

export const approveReviewFail = ({ errors }) => ({
  type: TYPES.approveReviewFail,
  errors
})

export const rejectReview = ({ comment, userId, history }) => ({
  type: TYPES.rejectReview,
  comment,
  userId,
  history
})

export const rejectReviewSuccess = ({ review }) => ({
  type: TYPES.rejectReviewSuccess,
  review
})

export const rejectReviewFail = ({ errors }) => ({
  type: TYPES.rejectReviewFail,
  errors
})

export const approveRequirement = ({ userId, requirementType }) => ({
  type: TYPES.approveRequirement,
  userId,
  requirementType
})

export const approveRequirementSuccess = ({ review }) => ({
  type: TYPES.approveRequirementSuccess,
  review
})

export const approveRequirementFail = ({ errors }) => ({
  type: TYPES.approveRequirementFail,
  errors
})

export const rejectRequirement = ({ comment, userId, requirementType }) => ({
  type: TYPES.rejectRequirement,
  comment,
  userId,
  requirementType
})

export const rejectRequirementSuccess = ({ review }) => ({
  type: TYPES.rejectRequirementSuccess,
  review
})

export const rejectRequirementFail = ({ errors }) => ({
  type: TYPES.rejectRequirementFail,
  errors
})

export const updatePhoneContract = ({ properties, userId }) => ({
  type: TYPES.updatePhoneContract,
  properties,
  userId
})

export const updatePhoneContractSuccess = ({ review }) => ({
  type: TYPES.updatePhoneContractSuccess,
  review
})

export const updatePhoneContractFail = ({ errors }) => ({
  type: TYPES.updatePhoneContractFail,
  errors
})

export const showComplianceView = ({ userId, history }) => ({
  type: TYPES.showComplianceView,
  userId,
  history
})

export const loadHistory = ({ userId }) => ({
  type: TYPES.loadHistory,
  userId
})

export const loadHistorySuccess = ({ data }) => ({
  type: TYPES.loadHistorySuccess,
  data
})

export const loadHistoryFail = ({ errors }) => ({
  type: TYPES.loadHistoryFail,
  errors
})

export const loadStats = ({ userId }) => ({
  type: TYPES.loadStats,
  userId
})

export const loadStatsSuccess = ({ data }) => ({
  type: TYPES.loadStatsSuccess,
  data
})

export const loadStatsFail = ({ errors }) => ({
  type: TYPES.loadStatsFail,
  errors
})
