import { createAction } from "redux-actions"

// Get events

export const fetchEventsRequest = createAction(
  "FETCH_EVENTS_REQUEST",
  (data, cb = () => {}) => [data, cb]
)

export const fetchEventsSuccess = createAction(
  "FETCH_EVENTS_SUCCESS",
  (data) => data
)
