---
to: src/view/<%= Name %>/component/V.<%= Name %>List.component.tsx
---
import React from 'react';
import { observer } from 'mobx-react';
import { D<%= Name %>Model } from '_domain/<%= Name %>'

export interface IV<%= Name %>ListProps {
  list: D<%= Name %>Model[];
}

@observer
export class V<%= Name %>List extends React.Component<IV<%= Name %>ListProps> {
  public render() {
    const { list } = this.props;

    return <div><%= Name %> List component</div>;
  }
}
