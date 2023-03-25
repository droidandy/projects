import queryString from "query-string"
import { createBrowserHistory } from "history"

function preserveQueryParameters(history, preserve, location) {
  const currentQuery = queryString.parse(history.location.search)
  const pathsToPreserve = ["/", "/sign_up", "/reset_password/blank"]
  const okpreserve =
    pathsToPreserve.indexOf(location.pathname) > -1 ||
    location.pathname.indexOf("newapp") > -1 ||
    location.pathname.indexOf("configureapp") > -1

  if (currentQuery && okpreserve) {
    const preservedQuery = {}
    for (const p of preserve) {
      const v = currentQuery[p]
      if (v) {
        preservedQuery[p] = v
      }
    }
    if (location.search) {
      Object.assign(preservedQuery, queryString.parse(location.search))
    }
    location.search = queryString.stringify(preservedQuery)
  }
  return location
}

function createLocationDescriptorObject(location, state) {
  return typeof location === "string"
    ? { pathname: location, state }
    : location
}

function createPreserveQueryHistory(createHistory, queryParameters) {
  return (options) => {
    const history = createHistory(options)
    const oldPush = history.push
    const oldReplace = history.replace
    history.push = (path, state) =>
      oldPush.apply(history, [
        preserveQueryParameters(
          history,
          queryParameters,
          createLocationDescriptorObject(path, state)
        )
      ])
    history.replace = (path, state) =>
      oldReplace.apply(history, [
        preserveQueryParameters(
          history,
          queryParameters,
          createLocationDescriptorObject(path, state)
        )
      ])
    return history
  }
}

const history = createPreserveQueryHistory(createBrowserHistory, [
  "onboarding",
  "ref",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term"
])()

export default history
