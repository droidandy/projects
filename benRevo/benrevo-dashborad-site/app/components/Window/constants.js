import { CARRIER, carriers } from '../../config';

export const ORIGIN = `${window.location.origin}/${carriers[CARRIER]}` ||
  `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}/${carriers[CARRIER]}` : `/${carriers[CARRIER]}`}`;
// UHC_PATH_FIX
