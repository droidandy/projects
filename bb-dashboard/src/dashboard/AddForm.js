import React from 'react'
import {Modal,FormGroup,Button,FormControl,ControlLabel} from 'react-bootstrap'
import {Typeahead} from 'react-bootstrap-typeahead'
import cryptosMap from './cryptos.js'
import newsSources from './newsSources.json'
import './AddForm.css'
import _ from 'lodash'

class AddForm extends React.Component{
  constructor() {
      super();
      this.state = {
        selected: [],
        selectedCrypto: '',
        cryptos:{},
        cryptoNames: [],
        newsSourceNames: [],
        typeValue: '',
        showNews: false
      };
      this._handleChange = this._handleChange.bind(this)
  }

  componentWillMount(){
    this.setState({
        cryptoNames: _.map(cryptosMap, c => c.name),
        newsSourceNames: _.map(newsSources, source => source.name)
    });
  }
  
  render(){
    return(
      <Modal 
        show={this.props.showModal} 
      >
        <Modal.Header>
          <Modal.Title>Add a widget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="addForm" onSubmit={this._onSubmit.bind(this)}>
            <div>
              <FormGroup controlId="formControlsSelect">
                <ControlLabel>Widget type</ControlLabel>
                <FormControl 
                  componentClass="select" 
                  placeholder="select" 
                  inputRef={(select) => this._type = select}
                  onChange={this._handleTypeChange.bind(this)}>
                  <option value="tweets">Live Twitter feed</option>
                  <option value="reddit">SubReddit</option>
                  <option value="gnews">Google News</option>
                  <option value="graph">Graph</option>
                  <option value="coin">Coin</option>
                  <option value="anews">News Aggregator</option>
                </FormControl>
              </FormGroup>
            </div>
            { !this.state.showNews ? (
            <div>
              <ControlLabel>Crypto</ControlLabel>
              <Typeahead
                labelKey="name"
                options={this.state.cryptoNames}
                placeholder="Choose a crypto"
                ref={ref => this._typeahead = ref}
                onChange={this._handleChange}
                multiple ={false}
                selected = {this.state.selected}
              />
            </div>) : (
            <div>
              <ControlLabel>News Source</ControlLabel>
              <Typeahead
                  className="anews"
                  labelKey="name"
                  options={this.state.newsSourceNames}
                  placeholder="Choose a news source"
                  ref={ref => this._typeahead = ref}
                  onChange={this._handleChange}
                  multiple ={true}
                  selected = {this.state.selected}
              />
              <div>
                <hr />
                <Button onClick={() => this.setState({selected: []})}>Clear All</Button>
                <Button onClick={()=>this.setState({selected: this.state.newsSourceNames.slice(0,20)})}>Select All</Button>
              </div>
            </div>)}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this._onSubmit.bind(this)} disabled={this.state.selected.length === 0}>Add widget</Button>
          <Button onClick={this.props.closeHandler}>Close</Button>
        </Modal.Footer>
      </Modal>
  )}

  _handleTypeChange(event){
    this.setState({
        selected: [],
        showNews: (event.target.value === "anews" ? true : false),
        typeValue: this._type.value
    });
  }

  _onSubmit(e){

    e.preventDefault();
    this.setState({ selected: [], showNews: false });

    let selectedCrypto = this.state.selectedCrypto;
    if (this._type.value !== "anews") {
      selectedCrypto = selectedCrypto[0];
    }

    if (this._type.value === "anews") {
        this.width = 5;
    }

    if (this._type.value ==="graph") {
        this.width = 8
    }else{
        this.width = 4
    }

    if (this._type.value ==="coin") {
        this.h = 7
        this.width = 2
    }else{
        this.h = 15
    }

    let options ={
        type :  this._type.value,
        crypto: selectedCrypto,
        width: this.width,
        h: this.h
    }

    this.props.addHandler(options)
    this.props.closeHandler()
  }

  _handleChange(text){
    this.setState({selectedCrypto: text, selected: text})
  }
}

export default AddForm;



