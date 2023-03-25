import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Table, Dropdown } from 'semantic-ui-react';

class SelectPerson extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    title: PropTypes.string.isRequired,
    itemKey: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    brokerage: PropTypes.object.isRequired,
    updateBrokerage: PropTypes.func.isRequired,
  };

  render() {
    const { title, list, brokerage, updateBrokerage, itemKey } = this.props;

    return (
      <Grid.Row className="select-person">
        <Grid.Column width="4">
          <div className="header3">{title}</div>
        </Grid.Column>
        <Grid.Column width="12">
          <Table className="data-table basic" unstackable>
            <Table.Header>
              <Table.Row className="data-table-head">
                <Table.HeaderCell width="8"><div className="header3">Edit {title.toUpperCase()} persons</div></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row className="data-table-body">
                <Table.Cell verticalAlign="top">
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width="8">
                        <Dropdown
                          placeholder="Choose"
                          search
                          selection
                          options={list}
                          value={brokerage[itemKey]}
                          onChange={(e, inputState) => { updateBrokerage(title.toLowerCase(), inputState.value); }}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default SelectPerson;
