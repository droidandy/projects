import { createAction } from 'redux-actions'

export const getTutorial = createAction(
  'GET_TUTORIAL',
  (payload, cb = () => {}, err = () => {}) => [payload, cb, err]
)

export const getTutorialSuccess = createAction(
  'GET_TUTORIAL_SUCCESS',
  (payload, cb = () => {}, err = () => {}) => [payload, cb, err]
)
