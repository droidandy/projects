export const origin = (CARRIER) => `${window.location.origin || `${window.location.protocol}//${window.location.host}`}/${CARRIER ? CARRIER.toLowerCase() : ''}` ||
    `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}/${CARRIER ? CARRIER.toLowerCase() : ''}` : `/${CARRIER ? CARRIER.toLowerCase() : ''}`}`;
