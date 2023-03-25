---
to: src/view/<%= Name %>/component/V.<%= Name %>Card.component.tsx
---
import React from 'react';
import { observer } from 'mobx-react';
import { D<%= Name %>Model } from '_domain/<%= Name %>'

export interface IV<%= Name %>CardProps {
  model: D<%= Name %>Model;
}

@observer
export class V<%= Name %>Card extends React.Component<IV<%= Name %>CardProps> {
  public render() {
    const { model } = this.props;

    return <div><%= Name %> Card</div>;
  }
}
