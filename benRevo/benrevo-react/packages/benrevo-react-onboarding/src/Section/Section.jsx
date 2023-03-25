import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Button, Popup } from 'semantic-ui-react';
import { scrollToInvalid } from '@benrevo/benrevo-react-core';
import Field from './components/Field'
import { checkCondition } from '../utils'
import * as types from '../types'
import { check } from '../FormValidator'

class Section extends React.Component  {
  static propTypes = {
    section: PropTypes.string.isRequired,
    page: PropTypes.string.isRequired,
    answers: PropTypes.object.isRequired,
    Questions: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    prevPage: PropTypes.func.isRequired,
    changeValue: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    deleteError: PropTypes.func.isRequired,
    saveAnswers: PropTypes.func.isRequired,
    deleteKey: PropTypes.func.isRequired,
    changeShowDisclosure: PropTypes.func.isRequired,
    getFile: PropTypes.func.isRequired,
    changeShowErrors: PropTypes.func.isRequired,
    showDisclosure: PropTypes.bool.isRequired,
    showErrors: PropTypes.bool.isRequired,
    showCopyClient: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const disclosure = props.section === 'disclosure' && props.page === 'section2';
    this.state = {
      disclosure,
    };

    this.changeField = this.changeField.bind(this);
    this.changePage = this.changePage.bind(this);
    this.copyClient = this.copyClient.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const disclosure = nextProps.section === 'disclosure' && nextProps.page === 'section2';
    this.setState({ disclosure: disclosure });
    if (nextProps.section === 'disclosure') {
      const show = this.checkDisclosure(nextProps);
      if (show !== nextProps.showDisclosure) this.props.changeShowDisclosure(show);
    }
  }

  componentWillMount() {
     if (this.state.disclosure) this.props.changeShowDisclosure(this.checkDisclosure(this.props));
  }

  componentDidMount() {
    const { showErrors, errors, changeShowErrors } = this.props;
    if (showErrors && errors && Object.keys(errors)[0]) {
      scrollToInvalid(Object.keys(errors));
      changeShowErrors(false);
    }
  }

  changeField(item, value, values) {
    let valid = check({ ...item, value }, this.props.answers, this.props.setError, this.props.deleteError);

    if (valid) this.props.changeValue(item.key, value, values);
  }

  changePage(type) {
    const props = this.props;
    const routes = this.props.routes[1].childRoutes;

    if (type === 'next') {
      props.saveAnswers();
    }

    routes.map((item, i) => {
      if (item.path === this.props.section) {
        item.childRoutes.map((item2, j) => {
          if (item2.path === this.props.page) {
            if (type === 'back') {
              if (j > 0) this.props.prevPage(`${item.path}/${item.childRoutes[j-1].path}`);
              else {
                const prevRoute = routes[i-1];
                this.props.prevPage(`${prevRoute.path}/${prevRoute.childRoutes[prevRoute.childRoutes.length-1].path}`);
              }
            } else {
              if (j < item.childRoutes.length-1) this.props.prevPage(`${item.path}/${item.childRoutes[j+1].path}`);
              else {
                const prevRoute = routes[i+1];
                if (prevRoute.childRoutes) this.props.prevPage(`${prevRoute.path}/${prevRoute.childRoutes[0].path}`);
                else this.props.prevPage(prevRoute.path);
              }
            }
            return true;
          }
          return true;
        });
        return true;
      }
      return true;
    });
  }

  checkDisclosure(props) {
    let show = false;
    const data1 = this.props.Questions['disclosure']['section1'].blocks;
    const data2 = this.props.Questions['disclosure']['section2'].blocks[0].data;


    data1.map((block) => {
      block.data.map((item) => {
        if (item.type === types.RADIO_MASSIVE) {
          item.children.map((item2) => {
            if (props.answers[item2.key] && props.answers[item2.key].value === 'Yes') {
              show = true;

              return true;
            }
          });
        } else if (props.answers[item.key] && props.answers[item.key].value === 'Yes') {
          show = true;

          return true;
        }

        return true;
      });
      return true;
    });

    for (let i = 0; i < 2; i += 1) {
      if (props.answers[data2[i].key] && props.answers[data2[i].key].value === 'Yes') {
        show = true;

        return true;
      }
    }

    return show;
  }

  copyClient() {
    const pageDataSection1 = this.props.Questions[this.props.section]['section1'].blocks[0].data;
    const pageData = this.props.Questions[this.props.section][this.props.page].blocks[0].data;

    for (let i = 0; i < pageData.length; i += 1) {
      const item = pageData[i];
      const answer = this.props.answers[pageDataSection1[i].key];

      if (answer) this.changeField(item, answer.value);
    }
  }

  render() {
    const { section, page, answers, errors, showDisclosure, Questions, showCopyClient } = this.props;
    const { disclosure } = this.state;
    const client2 = section === 'client' && page === 'section2';
    const pageData = (Questions[section]) ? Questions[section][page] : { blocks: [] };
    const build = (block, parentIndex) => {
      return (
        <div>
          {
            block.data.map((item, i) => {
              let itemKey;
              const template = (key, index) => {
                const title = (index && typeof title === 'string') ? item.title + ' ' + index : item.title;
                return (
                  <div key={key} className={className}>
                    <Header as="h3" className="rfpPageFormSetHeading">
                      {(typeof title === 'string') ? title : title(this.props)}
                      {item.info &&
                        <Popup
                          position="top center"
                          size="tiny"
                          trigger={<span className="field-info" />}
                          content={item.info}
                          inverted
                        />
                      }
                      </Header>
                    { item.additionalText && <div className="field-additional-text">{item.additionalText()}</div>}
                    <Field
                      itemKey={key}
                      errors={errors}
                      changeField={this.changeField}
                      item={item}
                      answer={answers[key]}
                      answers={answers}
                    />
                    {showCopyClient && client2 && i === 0 && <a className="action-button" onClick={this.copyClient}>Same as Point of Contact</a>}
                  </div>
                )
              };
              let hidden = false;
              let className = 'form-item';
              let count = 1;
              let rows = [];

              if (item.condition && checkCondition(item, answers, parentIndex)) hidden = true;

              if (item.inline && (block.data[i + 1].inline || block.data[i - 1].inline)) className += ' inline';

              if (hidden) return (<span key={i}></span>);

              if (item.dependency && answers[item.dependency]) {
                count = parseInt(answers[item.dependency].value, 10);
              } else if (item.dependency) count = 0;

              for (let j = 0; j < count; j += 1) {
                itemKey = item.key;
                if (parentIndex) itemKey += parentIndex;

                if (item.dependency) itemKey += j + 1;

                rows.push(
                  template(itemKey, (item.dependency) ? j + 1 : null)
                );
              }

              return (rows);
            })
          }
        </div>
      )
    };

    return (
      <Grid stackable columns={2} as={Segment} className="gridSegment">
        <Grid.Row>
          <Grid.Column width={16} textAlign="center" >
            <Header as="h1" className="rfpPageHeading">{pageData.title}</Header>
          </Grid.Column>
        </Grid.Row>

        {pageData.description &&
          <Grid.Row className="rfpRowDivider" centered>
            <Grid.Column width={8} textAlign="left" className="page-description">
              {pageData.description()}
            </Grid.Column>
          </Grid.Row>
        }

        {pageData.blocks.map((block, i) => {
          if (disclosure && (block.title === 'Select persons' || block.title === 'Person') && !showDisclosure) return false;

            const template = (title, index) => {
            const key = (index) ? title + ' ' + index : i;
            return (
              <Grid.Row className="rfpRowDivider" key={key}>
                <Grid.Column width={5}>
                  <Header as="h3" className="rfpPageSectionHeading">{title}</Header>
                </Grid.Column>
                <Grid.Column width={11}>
                  {build(block, index)}
                </Grid.Column>
              </Grid.Row>
            )
          };
          let count = 1;
          let rows = [];
          if (block.condition && checkCondition(block, answers)) return (<div key={i} />);

          if (block.dependency && answers[block.dependency]) {
            count = parseInt(answers[block.dependency].value, 10);
          } else if (block.dependency) count = 0;

          for (let j = 0; j < count; j += 1) {
            let title = block.title;

            if (block.dependency) title += ` ${j + 1}`;

            rows.push(
              template(title, (block.dependency) ? j + 1 : null)
            );
          }

          return (rows);
        })}
        { Questions[section] &&
          <Grid.Row>
            <div className="pageFooterActions">
              <Button onClick={() => { this.changePage('next'); }} primary floated={'right'} size='big'> Save & Continue</Button>
              { !(section === 'administrative' && page === 'section1') && <Button onClick={() => { this.changePage('back'); }} floated={'left'} basic size='big'>Back</Button> }
            </div>
          </Grid.Row>
        }
      </Grid>
    );
  }
}

export default Section;
