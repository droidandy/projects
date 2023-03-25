const LocalStorageService = (function() {
  let _service
  const urlSearchParams = new URLSearchParams(window.location.search);
  let switchUserToken = urlSearchParams.get("t");

  function _getService() {
    if (!_service) {
      _service = this

      return _service
    }

    return _service
  }

  function _setToken(tokenObj) {
    localStorage.setItem("token", tokenObj.token)
    localStorage.setItem("refresh_token", tokenObj.refresh_token)
  }

  function _getToken() {
    return switchUserToken || localStorage.getItem("token")
  }

  function _getRefreshToken() {
    return localStorage.getItem("refresh_token")
  }

  function _clearToken() {
    localStorage.removeItem("token")
    localStorage.removeItem("refresh_token")
    clearSwitchUserToken()
  }

  function getSwitchUserToken() {
    return switchUserToken;
  }

  function getOriginalToken() {
    return localStorage.getItem("token");
  }

  function clearSwitchUserToken() {
    switchUserToken = null;
  }

  return {
    getService: _getService,
    setToken: _setToken,
    getToken: _getToken,
    getRefreshToken: _getRefreshToken,
    clearToken: _clearToken,
    getSwitchUserToken,
    clearSwitchUserToken,
    getOriginalToken
  }
})()

export default LocalStorageService
