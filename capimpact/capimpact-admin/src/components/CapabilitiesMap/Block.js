import React from 'react';
import _ from 'lodash';

import Tooltip from 'components/Tooltip';
import classes from './styles.module.scss';

const Block = ({ colorScale, parent, capability, allFilters, groupfilters }) => {
  const { lense, tags, parentGroupFilter, groupFilter } = allFilters;
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
      <Tooltip className="bu-tooltip" target={target} placement="bottom" trigger="hover">
        {capability.name}
      </Tooltip>
    </div>
  );
};

export default Block;
