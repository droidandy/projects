import React from 'react';
import { Lookup } from 'src/types';
import { DisplayTransString } from 'src/components/DisplayTransString';
import styled from 'styled-components';
import { KPIScoringSlug } from 'shared/types';
import { ScoringIcon } from 'src/icons/ScoringIcon';

const Label = styled.div`
  svg {
    margin-left: 7px;
  }
`;

function getIcon(slug: KPIScoringSlug) {
  switch (slug) {
    case 'as-target':
      return <ScoringIcon colors={['red', 'red', 'green', 'green']} />;
    case 'bounded':
      return <ScoringIcon colors={['red', 'green', 'green', 'red']} />;
    case 'unscored':
      return <ScoringIcon colors={['gray', 'gray', 'gray', 'gray']} />;
    default:
      return <ScoringIcon colors={['red', 'yellow', 'green', 'blue']} />;
  }
}

export function useScoringOptions(lookups: Lookup[]) {
  return React.useMemo(() => {
    return lookups
      .filter(x => x.category === 'KPIScoringType')
      .map(item => ({
        label: (
          <Label>
            {getIcon(item.slug as KPIScoringSlug)}
            <DisplayTransString value={item} />
          </Label>
        ),
        value: item.id,
      }));
  }, [lookups]);
}
