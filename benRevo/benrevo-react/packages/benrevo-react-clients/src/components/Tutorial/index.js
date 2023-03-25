/**
 *
 * Tutorial
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Grid, Image, Header, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Preload from './Preloader/Preload';

class Tutorial extends React.PureComponent {
  static propTypes = {
    changeUserCount: PropTypes.func.isRequired,
    tutorial: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalOpen: true,
      page: 1,
      total: 8,
      pageImages: {},
    };

    this.modalToggle = this.modalToggle.bind(this);
    this.start = this.start.bind(this);
    this.changePage = this.changePage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  componentWillMount() {
    const importQuestions = this.props.tutorial.pages;
    const images = [];

    for (let i = 0; i < importQuestions.length; i += 1) {
      images.push(importQuestions[i].image);
    }

    Promise.all(images).then((data) => {
      this.setState({
        pageImages: {
          2: data[0],
          3: data[1],
          4: data[2],
          5: data[3],
          6: data[4],
          7: data[5],
          8: data[6],
        },
      });
    });
  }

  setPage(page) {
    this.setState({ page });
  }

  changePage(event) {
    const page = +event.target.innerHTML;
    this.setPage(page);
  }

  start() {
    this.setPage(2);
  }

  nextPage() {
    let page = this.state.page;
    this.setPage(page += 1);
  }

  modalToggle() {
    const close = !this.state.modalOpen;
    this.setState({ modalOpen: close });

    if (!close) this.props.changeUserCount();
  }

  render() {
    const { page, pageImages, changingPage } = this.state;
    const { tutorial } = this.props;
    const pageItem = (page > 1) ? tutorial.pages[page - 2] : null;
    const pages = [];

    for (let i = 1; i <= this.state.total; i += 1) {
      pages.push(i);
    }

    return (
      <Modal
        className="tutorial" // eslint-disable-line react/style-prop-objec
        open={this.state.modalOpen}
        onClose={this.modalToggle}
        closeOnDimmerClick={false}
        closeIcon={<span className="close">X</span>}
      >
        <Modal.Content className={(changingPage) ? 'animate-flicker' : ''}>
          <div className="sceme">
            { page === 1 &&
              <div className="main">
                <div className="main-header">{tutorial.title}</div>
                <div className="main-description">{tutorial.description}</div>
              </div>
            }
            { page > 1 &&
              <div className="page-image">
                <Preload
                  loadingIndicator={<Loader inline active size="big" />}
                  images={[pageImages[2], pageImages[3], pageImages[4], pageImages[5], pageImages[6], pageImages[7], pageImages[8]]}
                >
                  <Image className={`page-${page}`} style={{ float: (pageItem && pageItem.imagePosition) ? pageItem.imagePosition : 'none' }} src={pageImages[page]} />
                </Preload>
              </div>
            }
          </div>
          <Modal.Description>
            <Grid>
              <Grid.Row centered>
                <Grid.Column mobile="16" computer={(page === 1) ? '6' : '16'}>
                  { page === 1 && <Button className="button-start" onClick={this.start} primary size="big">Continue</Button> }
                  { page > 1 &&
                    <div className="page-description">
                      <Header>{pageItem.title}</Header>
                      <ol>
                        { pageItem.mode === 'inline' &&
                        <div>{pageItem.list[0].text}</div>
                        }
                        { pageItem.mode !== 'inline' && pageItem.list.map((item, i) => <li key={i}><span className="page-description-numeric">{i + 1}</span><span>{item.text}</span></li>) }
                      </ol>
                    </div>
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Grid className="navigation">
              <Grid.Row centered>
                <Grid.Column width="16" className="pages" textAlign="center" verticalAlign="middle">
                  {pages.map((item, i) => <a tabIndex="0" key={i} className={(page === item) ? 'active' : ''} onClick={this.changePage}>{item}</a>)}
                  { page < 8 && <Button className="button-next" size="small" onClick={this.nextPage} primary>Next</Button> }
                  { page === 8 && <Button className="button-next" size="small" onClick={this.modalToggle} primary>Done</Button> }
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

function mapStateToProps() {
  return {
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial);
