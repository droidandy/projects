---
to: src/view/<%= Name %>/component/V.<%= Name %>.component.tsx
---
import React from 'react';
import { observer } from 'mobx-react';
import { D<%= Name %>Model } from '_domain/<%= Name %>'

export interface IV<%= Name %>Props {
  model: D<%= Name %>Model;
}

@observer
export class V<%= Name %> extends React.Component<IV<%= Name %>Props> {
  public render() {
    const { model } = this.props;

    return <div><%= Name %></div>;
  }
}
