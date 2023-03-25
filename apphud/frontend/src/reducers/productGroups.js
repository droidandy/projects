import { handleActions } from "redux-actions"

import { fetchProductGroupsSuccess } from "../actions/productGroups"

const initialState = []

const productGroups = handleActions(
  {
    [fetchProductGroupsSuccess]: (state, action) => {
      return [...action.payload]
    }
  },
  initialState
)

export default productGroups
