import React from 'react';
import PropTypes from 'prop-types';
import { Table, Dropdown, Checkbox, Image } from 'semantic-ui-react';
import OosIcon from '../../../../assets/img/svg/oos-icon.svg';

class OptionNetworkItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    category: PropTypes.string.isRequired,
    anthem: PropTypes.bool.isRequired,
    title: PropTypes.string,
    data: PropTypes.object.isRequired,
    option1: PropTypes.object,
    networks: PropTypes.array.isRequired,
    changeOption1: PropTypes.func.isRequired,
    changeOption1Match: PropTypes.func.isRequired,
    changeOption1Group: PropTypes.func.isRequired,
    changeUsage: PropTypes.func.isRequired,
    usage: PropTypes.bool,
  };

  componentWillMount() {
    this.setKaiserNetwork();
  }

  componentDidUpdate() {
    this.setKaiserNetwork();
  }

  setKaiserNetwork() {
    const { category, data, changeOption1, option1 } = this.props;

    if (data.isKaiser && !option1) {
      changeOption1(category, data.planId, `Kaiser ${data.planType}`);
    }
  }

  render() {
    const { data, networks, option1, category, title, anthem, changeUsage, usage } = this.props;
    let quoteNetworkPlans = [];
    const networkList = [];
    const tempList = {};
    const groups = [
      {
        value: 'A',
        text: 'A',
      },
      {
        value: 'B',
        text: 'B',
      },
      {
        value: 'C',
        text: 'C',
      },
      {
        value: 'D',
        text: 'D',
      },
      {
        value: 'E',
        text: 'E',
      },
    ];
    networks.map((item) => {
      if (!tempList[item.rfpQuoteNetwork]) {
        networkList.push({
          key: item.rfpQuoteNetwork,
          value: item.rfpQuoteNetwork,
          text: item.rfpQuoteNetwork,
        });
        tempList[item.rfpQuoteNetwork] = true;
        if (option1 && item.rfpQuoteNetwork === option1.quoteOptionName) {
          quoteNetworkPlans = item.quoteNetworkPlans;
        }
      }

      return true;
    });

    return (
      <Table.Row className="data-table-body" verticalAlign="top">
        <Table.Cell verticalAlign="middle">
          <div>{title} {data.oos && <Image src={OosIcon} centered />}</div>
        </Table.Cell>
        <Table.Cell>
          <Checkbox checked={usage} onChange={(e, inputState) => { changeUsage(category, inputState.checked); }} className="use-plan" />
        </Table.Cell>
        { anthem &&
          <Table.Cell verticalAlign="middle">
            <Dropdown
              search
              selection
              options={groups}
              fluid
              value={(option1 && option1.networkGroup) ? option1.networkGroup : ''}
              onChange={(e, inputState) => { this.props.changeOption1Group(category, data.planId, inputState.value); }}
            />
          </Table.Cell>
        }
        <Table.Cell verticalAlign="middle">
          <div>{data.planType} - {data.planName}</div>
        </Table.Cell>
        <Table.Cell verticalAlign="middle">
          { (!data.isKaiser || category !== 'kaiser') &&
            <Dropdown
              placeholder="Choose"
              search
              selection
              options={networkList}
              value={(option1 && option1.quoteOptionName) ? option1.quoteOptionName : ''}
              onChange={(e, inputState) => { this.props.changeOption1(category, data.planId, inputState.value, data.optionId); }}
            />
          }
          { data.isKaiser && category === 'kaiser' &&
          <div>No change</div>
          }
        </Table.Cell>
        <Table.Cell verticalAlign="middle">
          <Dropdown
            placeholder="Choose"
            search
            selection
            options={quoteNetworkPlans}
            value={option1 && option1.pnnId}
            onChange={(e, inputState) => { this.props.changeOption1Match(category, data.planId, inputState.value, data.optionId); }}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default OptionNetworkItem;
