import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Input, Dropdown, TextArea, Form, Radio } from 'semantic-ui-react';
import {
  ATTR_VALID_WAIVERS,
  ATTR_INVALID_WAIVERS,
  ATTR_FIXED_UW_COMMENTS,
  ATTR_TEXT_UW_COMMENTS,
  ATTR_KAISER_OR_SIMNSA,
} from '@benrevo/benrevo-react-rfp';
import { UW_COMMENTS } from '../constants';

class ProductUW extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    attributes: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    updateAttribute: PropTypes.func.isRequired,
    updateClient: PropTypes.func.isRequired,
  };
  state = {
    showPopup: false,
  }

  componentWillMount() {
    if (Object.keys(this.props.attributes).length) {
      this.setState({
        showPopup: true,
      });
    }
  }

  render() {
    const {
      section,
      title,
      attributes,
      client,
      updateAttribute,
      updateClient,
    } = this.props;
    const { showPopup } = this.state;
    return (
      <Grid className="prequote-product">
        <Grid.Row>
          <Grid.Column width={16} textAlign="center">
            <Header as="h1" className="title1">{title} Underwriting Information</Header>
            <div className="title1-description">
              Let{'\''}s go over everything you need to get a quote for your client
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h1" className="title2">Underwriting Information</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6} only="computer" />
          <Grid.Column computer={8} tablet={16} mobile={16}>
            <Header as="h3" className="title-form">Valid Waivers</Header>
            <Input
              name={ATTR_VALID_WAIVERS}
              placeholder="Enter Valid Waivers"
              value={attributes[ATTR_VALID_WAIVERS] || ''}
              fluid
              onChange={(e, inputState) => { updateAttribute(section, ATTR_VALID_WAIVERS, inputState.value); }}
            />
            <Header as="h3" className="title-form">Invalid Waivers</Header>
            <Input
              name={ATTR_INVALID_WAIVERS}
              placeholder="Enter Invalid Waivers"
              value={attributes[ATTR_INVALID_WAIVERS] || ''}
              fluid
              onChange={(e, inputState) => { updateAttribute(section, ATTR_INVALID_WAIVERS, inputState.value); }}
            />
            <Header as="h3" className="title-form">Number of COBRA</Header>
            <Input
              name="cobraCount"
              placeholder="Enter COBRA count"
              value={client.cobraCount || ''}
              fluid
              onChange={(e, inputState) => { updateClient('cobraCount', inputState.value); }}
            />
            {
              showPopup &&
              <div className="factors-holder">
                <Header as="h3" className="title-form">PART ADJ 2</Header>
                {
                  Object.keys(attributes).map((attr, i) => (
                    <div key={i}>First-Adjustment Factor Load ({attr}): {attributes[attr]}</div>
                  ))
                }
              </div>
            }

            <Header as="h3" className="title-form">Are you aware of any large claims in excess of $50k within the past 12 months? If so, please include diagnosis, status and claim amount. Clear Value instant quote is subject to UW review if there are ongoing large claims. Anthem Blue Cross reserves the right to revise the quote after underwriter review.</Header>
            <Dropdown
              name={ATTR_FIXED_UW_COMMENTS}
              placeholder="Select"
              selection
              options={UW_COMMENTS}
              value={attributes[ATTR_FIXED_UW_COMMENTS]}
              fluid
              onChange={(e, inputState) => { updateAttribute(section, ATTR_FIXED_UW_COMMENTS, inputState.value); }}
            />
            <Header as="h3" className="title-form">Additonal Comments</Header>
            <Form>
              <TextArea
                rows={5}
                name={ATTR_TEXT_UW_COMMENTS}
                value={attributes[ATTR_TEXT_UW_COMMENTS] || ''}
                onChange={(e, inputState) => { updateAttribute(section, ATTR_TEXT_UW_COMMENTS, inputState.value); }}
              />
            </Form>
            <Header as="h3" className="title-form">Kaiser or SIMNSA</Header>
            <Form>
              <Form.Field>
                <Radio
                  label="N/A"
                  name={ATTR_KAISER_OR_SIMNSA}
                  value="N/A"
                  checked={attributes[ATTR_KAISER_OR_SIMNSA] === 'N/A'}
                  onChange={(e, inputState) => {
                    updateAttribute(section, ATTR_KAISER_OR_SIMNSA, inputState.value);
                  }}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Alongside Kaiser"
                  name={ATTR_KAISER_OR_SIMNSA}
                  value="Alongside Kaiser"
                  checked={attributes[ATTR_KAISER_OR_SIMNSA] === 'Alongside Kaiser'}
                  onChange={(e, inputState) => {
                    updateAttribute(section, ATTR_KAISER_OR_SIMNSA, inputState.value);
                  }}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Alongside SIMNSA"
                  name={ATTR_KAISER_OR_SIMNSA}
                  value="Alongside SIMNSA"
                  checked={attributes[ATTR_KAISER_OR_SIMNSA] === 'Alongside SIMNSA'}
                  onChange={(e, inputState) => {
                    updateAttribute(section, ATTR_KAISER_OR_SIMNSA, inputState.value);
                  }}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Alongside Kaiser/SIMNSA"
                  name={ATTR_KAISER_OR_SIMNSA}
                  value="Alongside Kaiser/SIMNSA"
                  checked={attributes[ATTR_KAISER_OR_SIMNSA] === 'Alongside Kaiser/SIMNSA'}
                  onChange={(e, inputState) => {
                    updateAttribute(section, ATTR_KAISER_OR_SIMNSA, inputState.value);
                  }}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Total Takeover"
                  name={ATTR_KAISER_OR_SIMNSA}
                  value="Total Takeover"
                  checked={attributes[ATTR_KAISER_OR_SIMNSA] === 'Total Takeover'}
                  onChange={(e, inputState) => {
                    updateAttribute(section, ATTR_KAISER_OR_SIMNSA, inputState.value);
                  }}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Alongside and Total Takeover"
                  name={ATTR_KAISER_OR_SIMNSA}
                  value="Alongside and Total Takeover"
                  checked={attributes[ATTR_KAISER_OR_SIMNSA] === 'Alongside and Total Takeover'}
                  onChange={(e, inputState) => {
                    updateAttribute(section, ATTR_KAISER_OR_SIMNSA, inputState.value);
                  }}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ProductUW;
