---
to: src/view/<%= Name %>/component/V.<%= Name %>Item.component.tsx
---
import React from 'react';
import { observer } from 'mobx-react';
import { D<%= Name %>Model } from '_domain/<%= Name %>'

export interface IV<%= Name %>ItemProps {
  model: D<%= Name %>Model;
}

@observer
export class V<%= Name %>Item extends React.Component<IV<%= Name %>ItemProps> {
  public render() {
    const { model } = this.props;

    return <div><%= Name %> Item</div>;
  }
}
