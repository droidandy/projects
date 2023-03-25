export const getApplication = (state) => state.application;

export const isApplicationForIos = (state) => {
    const { bundle_id, appstore_shared_secret } = getApplication(state);
    return !!bundle_id && !!appstore_shared_secret
}

export const isApplicationForAndroid = (state) => {
    const { package_name, google_service_account_json } = getApplication(state);
    return !!package_name && !!google_service_account_json
}

export const isApplicationCrossplatform = (state) => {
    return isApplicationForAndroid(state) && isApplicationForIos(state);
}
