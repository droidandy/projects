import { createAction } from "redux-actions"

// Get all fonts
export const fetchFontsRequest = createAction("FETCH_FONTS_REQUEST")

export const fetchFontsSuccess = createAction(
  "FETCH_FONTS_SUCCESS",
  (fonts) => fonts
)
