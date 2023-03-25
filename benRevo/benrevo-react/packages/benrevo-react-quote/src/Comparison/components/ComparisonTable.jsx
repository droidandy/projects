import React from 'react';
import PropTypes from 'prop-types';
import { Table, Grid, Input, Button, Icon } from 'semantic-ui-react';
import {
  DEC,
  MEDICAL_GROU_NAME,
  COUNTY,
  columns,
} from '../constants';

class Comparison extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    rows: PropTypes.array.isRequired,
    cols: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      column: null,
      stateRows: [],
      direction: null,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.dataSearch = this.dataSearch.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  componentDidMount() {
    const { rows } = this.props;
    this.setRowsData(rows);
  }

  componentWillReceiveProps(nextProps) {
    const { rows } = nextProps;
    this.setRowsData(rows);
  }

  setRowsData(stateRows) {
    this.setState({ stateRows });
  }

  dataSort(type) {
    const { stateRows, direction } = this.state;
    if (direction === 'ascending') {
      this.setState({
        column: type,
        stateRows: stateRows.sort((a, b) => {
          if ((a.hasOwnProperty(type)) && (b.hasOwnProperty(type))) {
            if (typeof a[type] === 'number') return a[type] - b[type];

            if (type == DEC && a[type].length > b[type].length) return 1;
            if (type == DEC && a[type].length < b[type].length) return -1;

            if (a[type] > b[type]) return 1;
            if (a[type] < b[type]) return -1;

            return 0;
          } else if (a.hasOwnProperty(type)) {
            return -1;
          } else if (b.hasOwnProperty(type)) {
            return 1;
          }

          return 0;
        }),
        direction: 'descending',
      });
      return;
    }

    this.setState({
      column: type,
      stateRows: stateRows.sort((a, b) => {
        if ((a.hasOwnProperty(type)) && (b.hasOwnProperty(type))) {
          if (typeof a[type] === 'number') return b[type] - a[type];
          if (a[type] < b[type]) return 1;
          if (a[type] > b[type]) return -1;

          return 0;
        } else if (a.hasOwnProperty(type)) {
          return 1;
        } else if (b.hasOwnProperty(type)) {
          return -1;
        }

        return 0;
      }),
      direction: 'ascending',
    });
  }

  dataSearch(event) {
    event.preventDefault();
    const { rows } = this.props;
    const value = event.target.value.toLowerCase();
    if (value && value.length > 0) {
      this.searchString = value;
      this.searchFunc(this.searchString);
    } else {
      this.searchString = '';
      this.setState({ rows });
    }
  }

  clearSearch(e) {
    e.preventDefault();
    const input = document.getElementById('searchInput');
    input.value = '';
    const { rows } = this.props;
    this.setState({ stateRows: rows });
  }

  searchFunc(value) {
    const { rows } = this.props;
    const filter = rows.filter((row) => {
      if (row[MEDICAL_GROU_NAME].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
        return row;
      }
      return null;
    });
    this.setState({ stateRows: filter });
  }

  render() {
    const { column, direction, stateRows } = this.state;
    const { cols } = this.props;
    return (
      <Grid className="comparison-table">
        <Grid.Row>
          <Input id="searchInput" iconPosition="left" icon="search" onChange={(e) => this.dataSearch(e)} action={<Button className="searchButton" onClick={(e) => this.clearSearch(e)} icon><Icon name="close" /></Button>} placeholder="Search..." />
        </Grid.Row>
        <Grid.Row>
          <Table sortable celled fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width="1" sorted={column === DEC ? direction : 'ascending'} onClick={() => this.dataSort(DEC)}>
                  DEC#
                </Table.HeaderCell>
                <Table.HeaderCell width="5" sorted={column === MEDICAL_GROU_NAME ? direction : 'ascending'} onClick={() => this.dataSort(MEDICAL_GROU_NAME)}>
                  Participating Medical Group Name
                </Table.HeaderCell>
                <Table.HeaderCell width="2" sorted={column === COUNTY ? direction : 'ascending'} onClick={() => this.dataSort(COUNTY)}>
                  County
                </Table.HeaderCell>
                { Object.keys(cols).map((key, i) =>
                  <Table.HeaderCell key={i} sorted={column === key ? direction : 'ascending'} onClick={() => this.dataSort(key)}>
                    {columns[key]}*
                  </Table.HeaderCell>
                )}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              { stateRows && stateRows.length > 0 &&
              stateRows.map((row, index) =>
                <Table.Row key={index}>
                  <Table.Cell>{row[DEC]}</Table.Cell>
                  <Table.Cell>{row[MEDICAL_GROU_NAME]}</Table.Cell>
                  <Table.Cell >{row[COUNTY]}</Table.Cell>
                  { Object.keys(cols).map((key, indxx) =>
                    <Table.Cell key={indxx}>
                      {row[key] === 1 && <span>{'X'}</span>}
                    </Table.Cell>
                  )}
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Comparison;
