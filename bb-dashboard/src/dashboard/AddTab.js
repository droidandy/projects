import React from 'react'
import { Modal, FormGroup, Button, FormControl, ControlLabel } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import cryptosMap from './cryptos.js'
import _ from 'lodash'

class AddTab extends React.Component{
  constructor() {
      super();
      this.state = {
        selectedCrypto: '',
        cryptoNames: [],
        currentType: 'custom',
        name: 'Custom'
      };
  }

  componentWillMount() {
    this.state.cryptoNames = _.map(cryptosMap, c => c.name)
  }

  render() {
    const { currentType, selectedCrypto, name, cryptoNames } = this.state
    const save = currentType === 'custom' || (currentType === 'coin' && selectedCrypto !== '')

    return(
      <Modal show={this.props.showModal}>
        <Modal.Header>
          <Modal.Title>Add new dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="addForm" onSubmit={this._onSubmit.bind(this)}>
            <div>
              <FormGroup controlId="formControlsSelect">
                <ControlLabel>Dashboard type</ControlLabel>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  onChange={this.onChangeType}
                  inputRef={(select)=>this._type = select}>
                  <option value="custom">Custom dashboard</option>
                  <option value="coin">Coin dashboard</option>
                </FormControl>
              </FormGroup>
            </div>
            {currentType === 'coin' &&
              <div>
                <ControlLabel>Crypto</ControlLabel>
                <Typeahead
                  labelKey="name"
                  options={cryptoNames}
                  placeholder="Choose a crypto"
                  onInputChange={this._handleChange}
                />
              </div>
            }
            <FormGroup>
              <ControlLabel>Dashboard name: </ControlLabel>
              <FormControl
                type="text"
                value={name}
                onChange={this.onChangeName}
                placeholder="Name of dashboard"
              />
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={!save} onClick={this._onSubmit}>Add dashboard</Button>
          <Button onClick={this.props.closeHandler}>Close</Button>
        </Modal.Footer>
      </Modal>
  )}

  onChangeType = e => {
    const value = e.target.value
    this.setState({
      currentType: value,
      selectedCrypto: '',
      name: value.charAt(0).toUpperCase() + value.slice(1)
    })
  }

  onChangeName = e => {
    this.setState({name: e.target.value})
  }

  _onSubmit = e => {
    e.preventDefault()
    const { name, selectedCrypto } = this.state
    if (!name) {
      alert('Type the name of dashboard.')
    } else {
      let options = {
        name,
        type: this._type.value,
        crypto: selectedCrypto,
      }

      this.props.addHandler(options)
      this.props.closeHandler()
      this.setState({
        name: 'Custom',
        currentType: 'custom',
        selectedCrypto: '',
      })
    }
  }

  _handleChange = text => {
    this.setState({
      selectedCrypto: text,
      name: text
    })
  }
}

export default AddTab;
