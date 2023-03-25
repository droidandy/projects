import { updateLeadSource } from 'api/profile';
import { LeadSourceInfo } from 'types/LeadSourceInfo';
import { GA_CLIENT_ID_COOKIE, LEAD_SOURCE_COOKIE } from '../analytics/constants';
import { cookies } from './cookies';

const getGaClientId = () => {
  const cookie = cookies.get(GA_CLIENT_ID_COOKIE);

  return cookie ? cookie.slice(6) : null;
};

export const getLeadInfo = () => {
  const cookie = cookies.get(LEAD_SOURCE_COOKIE);

  if (cookie) {
    const { utm_source, utm_medium, utm_campaign, utm_term, utm_content, exp_time } = cookie;
    return {
      utmSource: utm_source,
      utmMedium: utm_medium,
      utmCampaign: utm_campaign,
      utmTerm: utm_term,
      utmContent: utm_content,
      timestamp: exp_time,
      utmUserAgent: window?.navigator?.userAgent,
    };
  }

  return null;
};

export const enrichWithLeadSourceMeta = <T>(
  enrichable: T,
  timestamp?: number,
): T & { meta?: Partial<LeadSourceInfo> } => {
  const leadSource = getLeadInfo();
  const gaClientId = getGaClientId();

  return {
    ...enrichable,
    ...(leadSource
      ? {
          meta: { ...leadSource, clientId: gaClientId, timestamp: timestamp || leadSource.timestamp },
        }
      : {}),
  };
};

export const clearLeadSourceCookie = () => {
  cookies.remove(LEAD_SOURCE_COOKIE, { path: '/' });
};

export const handleLeadSourceCookies = (userId: string) => {
  const leadCookie = getLeadInfo();
  const gaClientId = getGaClientId();

  if (leadCookie) {
    updateLeadSource({
      userId,
      ...leadCookie,
      clientId: gaClientId,
    }).then(clearLeadSourceCookie);
  }
};
