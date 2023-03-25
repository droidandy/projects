import React from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import { getTreeFromFlatData } from 'react-sortable-tree';
import { CheckboxField, SelectField, RadiosField, MultipleButtonGroupField } from 'lib/form/fields';
// import slugify from 'slugify';

import {
  getCompaniesAction,
  getLenses,
  getGrouptagsAction,
  getGroupfiltersAction,
} from 'api/actions';

import Spinner from 'components/Spinner';
// import Tooltip from 'components/Tooltip';

import { getIndustriesWithCompanies } from 'lib/data';

const useData = ({ company, values }) => {
  const { loading: l1, payload: data = [] } = useQuery(getCompaniesAction());
  const { loading: l2, payload: lenses = [] } = useQuery(getLenses());
  const { loading: l3, payload: grouptags = [] } = useQuery(
    getGrouptagsAction({ companyId: company.id })
  );
  const { loading: l4, payload: groupfilters = [] } = useQuery(
    getGroupfiltersAction({ companyId: company.id })
  );

  const loading = l1 || l2 || l3 || l4;

  const industries = getIndustriesWithCompanies(data);
  const industryOptions = industries.map(({ id, name }) => ({ label: name, value: id }));
  const industry = industries.find(ind => ind.id === values.industryId);
  const companies = (industry && industry.companies) || [];
  const companyOptions = companies.map(({ id, name }) => ({ label: name, value: id }));

  const treegroupfilters = getTreeFromFlatData({
    flatData: groupfilters,
    getKey: node => node.id,
    getParentKey: node => node.parentId,
    rootKey: null,
  });

  const lenseOptions = [{ label: 'All', value: 'all' }].concat(
    lenses.map(d => ({
      value: d.name,
      label: d.name,
    }))
  );

  const grouptagOptions = grouptags.map(it => ({ label: it.name, value: it.id }));
  let tagOptions = [];
  if (values.group) {
    const grp = grouptags.find(it => it.id === values.group);
    if (grp) {
      tagOptions = grp.tags;
    }
  }

  const parentGroupFilterOptions = treegroupfilters.map(it => ({ label: it.name, value: it.id }));
  let groupFilterOptions = [];
  if (values.parentGroupFilter) {
    groupFilterOptions = groupfilters
      .filter(it => it.parentId === values.parentGroupFilter)
      .map(it => ({ label: it.name, value: it.name }));
  }

  return {
    loading,
    industries,
    industry,
    industryOptions,
    companies,
    companyOptions,
    lenseOptions,
    grouptagOptions,
    tagOptions,
    parentGroupFilterOptions,
    groupFilterOptions,
  };
};

const Filters = ({ company, values }) => {
  const history = useHistory();

  const {
    loading,
    industries,
    industryOptions,
    companyOptions,
    lenseOptions,
    grouptagOptions,
    tagOptions,
    parentGroupFilterOptions,
    groupFilterOptions,
  } = useData({ company, values });

  return loading ? (
    <Spinner />
  ) : (
    <div>
      <SelectField
        name="industryId"
        label="Industry"
        options={industryOptions}
        handleChange={({ value }) => {
          const ind = industries.find(ind => String(ind.id) === String(value));
          const com = ind && ind.companies[0];
          history.push(`/companies/${com.id}/view`);
        }}
      />
      <SelectField
        name="companyId"
        label="Company"
        options={companyOptions}
        handleChange={({ value }) => {
          history.push(`/companies/${value}/view`);
        }}
      />

      <RadiosField name="lense" label="Lenses" options={lenseOptions} />

      <SelectField
        name="parentGroupFilter"
        label="Filter Groups"
        options={parentGroupFilterOptions}
        isClearable
      />
      {groupFilterOptions && groupFilterOptions.length > 0 && (
        <RadiosField name="groupFilter" options={groupFilterOptions} />
      )}

      <SelectField name="group" label="Tag Groups" options={grouptagOptions} isClearable />
      <MultipleButtonGroupField name="tags" options={tagOptions} />

      <CheckboxField name="showPartnerNetwork" label="Filter Partner Network Capabilities" custom />
    </div>
  );
};

export default Filters;
