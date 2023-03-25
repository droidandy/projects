import React from 'react';
import { useQuery } from 'react-fetching-library';
import classNames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';

import {
  getTreeCapabilitiesAction,
  getChallengesAction,
  getLenses,
  getCapabilitiesByIdsAction,
  getGrouptagsAction,
  getGroupfiltersAction,
} from 'api/actions';

import Spinner from 'components/Spinner';
import Tooltip from 'components/Tooltip';

import classes from './styles.module.scss';

const useData = ({ company, allFilters }) => {
  const { loading: lenseLoading, payload: lenses = [] } = useQuery(getLenses());
  const { loading: grouptagsLoading, payload: grouptags = [] } = useQuery(
    getGrouptagsAction({ companyId: company.id })
  );
  const { loading: groupfiltersLoading, payload: groupfilters = [] } = useQuery(
    getGroupfiltersAction({ companyId: company.id })
  );
  const { loading: challengesLoading, payload: challenges = [] } = useQuery(
    getChallengesAction({ companyId: company.id })
  );
  const { loading: capTreeLoading, payload: tree = {} } = useQuery(
    getTreeCapabilitiesAction({ company_id: company.id })
  );
  let parentCaps = (tree && tree.children) || [];
  let childs = _.uniqBy(
    parentCaps.reduce((prev, cap) => prev.concat(cap.children), []),
    'id'
  );
  let capabilityIds = childs.map(cap => cap.id);
  const { loading: capsLoading, payload: capabilities = [], query: refetch } = useQuery(
    getCapabilitiesByIdsAction({ ids: capabilityIds })
  );
  let childCaps = Array.from(capabilities || []).map(it => {
    const classifications = it.classifications.reduce(
      (o, cls) => ({ ...o, [cls.lense.name]: cls.name }),
      {}
    );
    const capitalCosts = parseInt(it.capitalCosts, 10) || 0;
    const salaryCosts = parseInt(it.salaryCosts, 10) || 0;
    const fte = parseInt(it.fte, 10) || 0;
    const totalCosts = capitalCosts + salaryCosts;
    return {
      ...it,
      ...classifications,
      ...it.tags,
      capitalCosts,
      salaryCosts,
      fte,
      totalCosts,
    };
  });
  const loading =
    lenseLoading ||
    challengesLoading ||
    capTreeLoading ||
    capsLoading ||
    grouptagsLoading ||
    groupfiltersLoading;

  if (!loading) {
    const challengesCaps = challenges.reduce((o, ch) => {
      return o.concat([
        {
          id: ch.id,
          name: ch.name,
          capabilities: _.union(...ch.issues.map(iss => iss.capabilities)),
        },
      ]);
    }, []);
    const selectedGroupTags = grouptags.find(it => it.id === allFilters.group);
    const parentGroupFilter = groupfilters.find(it => it.id === allFilters.parentGroupFilter);
    childCaps = childCaps.map(it => {
      return {
        ...it,
        challenges: challengesCaps
          .filter(({ capabilities: caps }) => {
            return caps.map(({ id }) => id).includes(it.id);
          })
          .map(({ id, name }) => ({ id, name })),
        selectedTags: Array.from(
          (selectedGroupTags &&
            it.tags &&
            it.tags[`${selectedGroupTags.id}_${selectedGroupTags.name}`]) ||
            []
        ).map(({ value }) => value),
        groupFilters:
          (parentGroupFilter &&
            it.filters &&
            it.filters[`${parentGroupFilter.id}_${parentGroupFilter.name}`]) ||
          {},
      };
    });
  }

  return {
    loading,
    parentCaps,
    childCaps,
    challenges,
    lenses,
    grouptags,
    groupfilters,
    refetch,
  };
};

const BuViewTable = ({ allFilters, company }) => {
  const {
    parentCaps,
    childCaps,
    challenges,
    lenses,
    grouptags,
    groupfilters,
    refetch,
    loading,
  } = useData({ company, allFilters });
  const { lense, tags, parentGroupFilter, groupFilter } = allFilters;
  let colorScale = d3.scaleOrdinal().range(['#094470'].concat(d3.schemePaired));

  // Set color scale domain
  if (parentGroupFilter && groupFilter) {
    const subgroup = groupfilters.find(
      p => p.parentId === parentGroupFilter && p.name === groupFilter
    );
    if (subgroup) {
      colorScale.domain(subgroup.filters);
    }
  } else if (lense !== 'all') {
    const found = lenses.find(l => l.name === lense);
    if (found) {
      colorScale.domain(found.classifications.map(c => c.name));
    }
  }

  const categorizationDomains = colorScale.domain();

  return loading || (childCaps && childCaps.length === 0) ? (
    <Spinner />
  ) : (
    <div className={classNames(classes.buTableContainer, 'table-responsive')}>
      {categorizationDomains && categorizationDomains.length > 0 ? (
        <div className="d-flex align-items-center">
          {categorizationDomains.map((domain, index) => (
            <div key={index} className="d-flex align-items-center mx-1 mb-2">
              <div
                style={{
                  backgroundColor: colorScale(domain),
                  width: 20,
                  height: 20,
                  marginRight: 4,
                }}
              ></div>
              <div>{domain}</div>
            </div>
          ))}
        </div>
      ) : null}
      <table className="table">
        <thead>
          <tr>
            {parentCaps.map(cap => (
              <th key={cap.id} scope="col">
                {cap.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {parentCaps.map(parent => (
              <td key={parent.id}>
                {parent.children.map(child => {
                  let capability = childCaps.find(c => c.id === child.id);
                  let target = `cap_${parent.id}_${capability.id}`;
                  let selectedByTags = false;
                  let backgroundColor = '#4a708c';

                  if (parentGroupFilter && groupFilter) {
                    const subgroup = groupfilters.find(
                      p => p.parentId === parentGroupFilter && p.name === groupFilter
                    );
                    if (subgroup) {
                      const value = capability.groupFilters[`${subgroup.id}_${subgroup.name}`];
                      if (value) {
                        backgroundColor = colorScale(value);
                      }
                    }
                  } else if (lense !== 'all') {
                    if (capability[lense]) {
                      backgroundColor = colorScale(capability[lense]);
                    }
                  }

                  if (_.intersection(capability.selectedTags, tags).length > 0) {
                    selectedByTags = true;
                  }

                  return (
                    <div key={capability.id}>
                      <div
                        className={classes.buBlock}
                        id={target}
                        style={{
                          backgroundColor,
                          borderWidth: selectedByTags ? 2 : 0,
                          borderColor: selectedByTags ? '#f4803c' : '#4a708c',
                        }}
                      >
                        {capability.name}
                      </div>
                      <Tooltip
                        className="bu-tooltip"
                        target={target}
                        placement="bottom"
                        trigger="hover"
                      >
                        {capability.name}
                      </Tooltip>
                    </div>
                  );
                })}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BuViewTable;
