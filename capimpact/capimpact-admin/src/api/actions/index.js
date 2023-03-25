import qs from 'qs';

// const tokenStartUps = process.env.REACT_APP_TOKEN_STARTUPS_API;

/* Auth */
export const loginAction = ({ data }) => ({
  method: 'POST',
  endpoint: '/auth/login',
  body: data,
});

/* Industries */
export const getIndustriesAction = () => ({
  method: 'GET',
  endpoint: '/industries',
});

export const getIndustryAction = ({ industryId }) => ({
  method: 'GET',
  endpoint: `/industries/${industryId}`,
});

export const addIndustryAction = ({ data }) => ({
  method: 'POST',
  endpoint: '/industries',
  body: data,
});

export const saveIndustryAction = ({ industryId, data }) => ({
  method: 'POST',
  endpoint: `/industries/${industryId}`,
  body: data,
});

export const cloneIndustryAction = ({ industryId, data }) => ({
  method: 'POST',
  endpoint: `/industries/${industryId}/clone`,
  body: data,
});

export const deleteIndustryAction = ({ industryId }) => ({
  method: 'DELETE',
  endpoint: `/industries/${industryId}`,
});

/* Processes */
export const getTreeProcessesAction = industryId => ({
  method: 'GET',
  endpoint: `/processes/tree`,
  query: { industry_id: industryId },
});

export const getTreeOriginalProcessesAction = industryId => ({
  method: 'GET',
  endpoint: `/processes/default-tree`,
  query: { industry_id: industryId },
});

export const getProcessAction = ({ processId }) => ({
  method: 'GET',
  endpoint: `/processes/${processId}`,
});

export const addProcessAction = ({ data }) => ({
  method: 'POST',
  endpoint: '/processes',
  body: data,
});

export const saveProcessAction = ({ processId, nodeId, data }) => ({
  method: 'POST',
  endpoint: `/processes/${processId || nodeId}`,
  body: data,
});

export const saveProcessesAction = ({ data }) => ({
  method: 'POST',
  endpoint: `/processes/bulk`,
  body: data,
});

export const deleteProcessAction = ({ processId, nodeId }) => ({
  method: 'DELETE',
  endpoint: `/processes/${processId || nodeId}`,
});

/* Capabilities */
export const getTreeCapabilitiesAction = (params = {}) => ({
  method: 'GET',
  endpoint: `/capabilities/tree`,
  query: params,
});

export const getCapabilitiesByIdsAction = params => {
  let queryString = params.ids.length ? qs.stringify(params) : 'ids[]=';
  return {
    method: 'GET',
    endpoint: `/capabilities?${queryString}`,
  };
};

export const getTreeOriginalCapabilitiesAction = industryId => ({
  method: 'GET',
  endpoint: `/capabilities/default-tree`,
  query: { industry_id: industryId },
});

export const getCapabilityAction = ({ capabilityId }) => ({
  method: 'GET',
  endpoint: `/capabilities/${capabilityId}`,
});

export const addCapabilityAction = ({ data }) => ({
  method: 'POST',
  endpoint: '/capabilities',
  body: data,
});

export const saveCapabilityAction = ({ capabilityId, nodeId, data }) => ({
  method: 'POST',
  endpoint: `/capabilities/${capabilityId || nodeId}`,
  body: data,
});

export const saveCapabilitiesAction = ({ data }) => ({
  method: 'POST',
  endpoint: `/capabilities/bulk`,
  body: data,
});

export const saveCapabilitiesClassificationAction = ({ data }) => ({
  method: 'POST',
  endpoint: `/capabilities/classification`,
  body: data,
});

export const deleteCapabilityAction = ({ capabilityId, nodeId }) => ({
  method: 'DELETE',
  endpoint: `/capabilities/${capabilityId || nodeId}`,
});

/* Start Ups */
export const getStartUpsAction = ({ industryId, skip = 0, limit = 25, sort = ['name', 'ASC'] }) => {
  return {
    method: 'GET',
    endpoint: `/startups`,
    query: { industry_id: industryId, skip, limit, sort },
  };
};

export const getStartUpAction = ({ startupId, nodeId }) => ({
  method: 'GET',
  endpoint: `/startups/${startupId || nodeId}`,
});

export const getCountStartUpsAction = ({ industryId }) => ({
  method: 'GET',
  endpoint: `/startups/count`,
  query: { industry_id: industryId },
});

export const saveStartupAction = ({ startupId, nodeId, data }) => {
  return {
    method: 'POST',
    endpoint: `/startups/${startupId || nodeId}`,
    body: data,
  };
};

/* Companies */
export const getCompanyPartnerNetworksAction = ({ cid }) => ({
  method: 'GET',
  //endpoint: `http://35.153.253.163:3001/graph/company/?cid=${cid}&nhops=2`,
  endpoint: `/companies/${cid}/partner-networks`,
});

export const getCompanyPartnerNetworkAction = ({ cid }) => ({
  method: 'GET',
  endpoint: `/companies/partner-networks/${cid}`,
});

export const saveCompanyCapabilitiesAction = ({ cid, capabilities }) => ({
  method: 'POST',
  endpoint: `/companies/${cid}/capabilities`,
  body: {
    cid,
    capabilities,
  },
});

export const getCompaniesAction = () => ({
  method: 'GET',
  endpoint: '/companies',
});

export const getCompanyAction = ({ companyId }) => ({
  method: 'GET',
  endpoint: `/companies/${companyId}`,
});

export const addCompanyAction = ({ data }) => ({
  method: 'POST',
  endpoint: '/companies',
  body: data,
});

export const saveCompanyAction = ({ companyId, data }) => ({
  method: 'POST',
  endpoint: `/companies/${companyId}`,
  body: data,
});

export const cloneCompanyAction = ({ companyId, data }) => ({
  method: 'POST',
  endpoint: `/companies/${companyId}/clone`,
  body: data,
});

export const deleteCompanyAction = ({ companyId }) => ({
  method: 'DELETE',
  endpoint: `/companies/${companyId}`,
});

export const getLenses = () => ({
  method: 'GET',
  endpoint: '/lenses',
});

/* KPI libs */
export const getKpilibsAction = ({ skip = 0, limit = 25, sort }) => {
  return {
    method: 'GET',
    endpoint: `/kpilibs`,
    query: { skip, limit, sort },
  };
};

export const getCountKpilibsAction = () => ({
  method: 'GET',
  endpoint: `/kpilibs/count`,
});

export const getKpilibAction = ({ kpilibId, nodeId }) => ({
  method: 'GET',
  endpoint: `/kpilibs/${kpilibId || nodeId}`,
});

export const addKpilibAction = ({ data }) => ({
  method: 'POST',
  endpoint: '/kpilibs',
  body: data,
});

export const saveKpilibAction = ({ kpilibId, nodeId, data }) => {
  return {
    method: 'POST',
    endpoint: `/kpilibs/${kpilibId || nodeId}`,
    body: data,
  };
};

export const deleteKpilibAction = ({ kpilibId }) => ({
  method: 'DELETE',
  endpoint: `/kpilibs/${kpilibId}`,
});

/* Challenges */
export const getChallengesAction = (params = {}) => {
  return {
    method: 'GET',
    endpoint: `/challenges`,
    query: params,
  };
};

/* Grouptags */
export const getGrouptagsAction = ({ companyId, skip = 0, limit = 0, sort = ['name', 'ASC'] }) => {
  return {
    method: 'GET',
    endpoint: `/grouptags`,
    query: { companyId, skip, limit, sort },
  };
};

export const getGrouptagAction = ({ grouptagId }) => ({
  method: 'GET',
  endpoint: `/grouptags/${grouptagId}`,
});

export const addGrouptagAction = ({ data }) => ({
  method: 'POST',
  endpoint: '/grouptags',
  body: data,
});

export const saveGrouptagAction = ({ grouptagId, data }) => {
  return {
    method: 'POST',
    endpoint: `/grouptags/${grouptagId}`,
    body: data,
  };
};

export const saveGrouptagsAction = ({ data }) => {
  return {
    method: 'POST',
    endpoint: `/grouptags/save-many`,
    body: data,
  };
};

export const deleteGrouptagAction = ({ grouptagId }) => ({
  method: 'DELETE',
  endpoint: `/grouptags/${grouptagId}`,
});

/* Groupfilters */
export const getGroupfiltersAction = ({
  companyId,
  skip = 0,
  limit = 0,
  sort = ['name', 'ASC'],
}) => {
  return {
    method: 'GET',
    endpoint: `/groupfilters`,
    query: { companyId, skip, limit, sort },
  };
};

export const getGroupfilterAction = ({ groupfilterId }) => ({
  method: 'GET',
  endpoint: `/groupfilters/${groupfilterId}`,
});

export const addGroupfilterAction = ({ data }) => ({
  method: 'POST',
  endpoint: '/groupfilters',
  body: data,
});

export const saveGroupfilterAction = ({ groupfilterId, data }) => {
  return {
    method: 'POST',
    endpoint: `/groupfilters/${groupfilterId}`,
    body: data,
  };
};

export const saveGroupfiltersAction = ({ data }) => {
  return {
    method: 'POST',
    endpoint: `/groupfilters/save-many`,
    body: data,
  };
};

export const deleteGroupfilterAction = ({ groupfilterId }) => ({
  method: 'DELETE',
  endpoint: `/groupfilters/${groupfilterId}`,
});

/* ValueDrivers */
export const getTreeValueDriversAction = (params = {}) => ({
  method: 'GET',
  endpoint: `/valuedrivers/tree`,
  query: params,
});

export const getTreeOriginalValueDriversAction = industryId => ({
  method: 'GET',
  endpoint: `/valuedrivers/default-tree`,
  query: { industryId },
});

export const getValueDriverAction = ({ valueDriverId }) => ({
  method: 'GET',
  endpoint: `/valuedrivers/${valueDriverId}`,
});

export const addValueDriverAction = ({ data }) => ({
  method: 'POST',
  endpoint: '/valuedrivers',
  body: data,
});

export const saveValueDriverAction = ({ valueDriverId, nodeId, data }) => ({
  method: 'POST',
  endpoint: `/valuedrivers/${valueDriverId || nodeId}`,
  body: data,
});

export const saveValueDriversAction = ({ data }) => ({
  method: 'POST',
  endpoint: `/valuedrivers/bulk`,
  body: data,
});

export const deleteValueDriverAction = ({ valueDriverId, nodeId }) => ({
  method: 'DELETE',
  endpoint: `/valuedrivers/${valueDriverId || nodeId}`,
});
