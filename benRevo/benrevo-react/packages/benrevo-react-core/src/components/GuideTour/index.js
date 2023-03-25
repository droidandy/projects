/**
 *
 * GuideTour
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Grid, Image, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Scroller from 'react-scroll';
import pages from './pages';
import { changeAttribute } from '../../utils/authService/actions';
const scroll = Scroller.animateScroll;

class GuideTour extends React.PureComponent {
  static propTypes = {
    page: PropTypes.string.isRequired,
    attributes: PropTypes.array,
    changeAttribute: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      active: true,
      currentTip: 0,
      rectWidth: 0,
      rectHeight: 0,
      rectLeft: 0,
      rectTop: 0,
      rect2Width: 0,
      rect2Height: 0,
      rect2Left: 0,
      rect2Top: 0,
      tip: {},
    };
  }

  componentWillMount() {
    const show = this.checkAttribute();

    if (show) {
      const images = [];
      const page = this.props.page;
      const tip = pages[page].tips[this.state.currentTip];

      this.setState({ tip, images });
      this.calculate = this.calculate.bind(this);
      this.nextTip = this.nextTip.bind(this);
      this.calculate();
      window.addEventListener('resize', this.calculate);
      window.addEventListener('scroll', this.calculate);
    }
  }

  componentDidMount() {
    if (this.state.active) {
      document.body.classList.add('guide-tour-scrolling');
      this.scrollPage();
     // this.calculate();
    }
  }

  componentDidUpdate() {
    if (this.state.active) {
      this.calculate();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calculate);
    window.removeEventListener('scroll', this.calculate);
   // events.scrollEvent.remove('end');
    document.body.classList.remove('guide-tour-scrolling');
  }

  componentDidCatch() {
  }

  checkAttribute() {
    const attributes = this.props.attributes;
    const attribute = pages[this.props.page].attribute;
    // return true;
    if (!attributes) {
      this.setState({ active: false });
      return false;
    }

    for (let i = 0; i < attributes.length; i += 1) {
      const item = attributes[i];

      if (item === attribute) {
        this.setState({ active: false });
        return false;
      }
    }

    return true;
  }

  scrollPage(tip = this.state.tip) {
    let scrollTo = tip.scrollTo;
    const current = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTo || (this.state.currentTip === 0 && current > 0)) {
      if (!scrollTo) scrollTo = 1;
      scroll.scrollTo(scrollTo, { duration: 1000, ignoreCancelEvents: true });
    }
  }

  calculate() {
    const padding = this.state.tip.padding || 0;
    const offset = padding ? padding / 2 : 0;
    const elem = document.querySelector(this.state.tip.elem);
    if (!elem) {
      if (this.state.tip.elem) this.nextTip();
      return;
    }
    const rect = elem.getBoundingClientRect();

    this.setState({ rectWidth: rect.width + padding, rectHeight: rect.height + padding, rectLeft: rect.left - offset, rectTop: rect.top - offset });

    if (this.state.tip.elem2) {
      const elem2 = document.querySelector(this.state.tip.elem2);
      const rect2 = elem2.getBoundingClientRect();

      this.setState({ rect2Width: rect2.width + padding, rect2Height: rect2.height + padding, rect2Left: rect2.left - offset, rect2Top: rect2.top - offset });
    } else this.setState({ rect2Width: 0, rect2Height: 0, rect2Left: 0, rect2Top: 0 });
  }

  nextTip() {
    const page = this.props.page;
    if (this.isEnd) {
      this.setState({ active: false }, () => {
        this.props.changeAttribute(pages[page].attribute);
        document.body.classList.remove('guide-tour-scrolling');
      });
      return;
    }
    const next = this.state.currentTip + 1;
    const tip = pages[page].tips[next];
    this.guideText = null;
    this.setState({ tip, currentTip: next, rectWidth: null, rectHeight: null, rectLeft: null, rectTop: null }, () => {
      this.scrollPage(tip);
    });
  }

  get isEnd() {
    return this.state.currentTip === pages[this.props.page].tips.length - 1;
  }

  get rectCenter() {
    const { rectWidth, rectHeight, rectLeft, rectTop, rect2Width, rect2Left } = this.state;
    return {
      x: (rectLeft + ((rectWidth + (rect2Width ? (rect2Left - (rectLeft + rectWidth)) + rect2Width : 0)) / 2)),
      y: (rectTop + (rectHeight / 2)),
    };
  }

  render() {
    const { tip, rectWidth, rectHeight, rectLeft, rectTop, rect2Width, rect2Height, rect2Left, rect2Top, active, currentTip } = this.state;
    let guideTextWidth = 290;
    let tipPosition = tip.tipPosition;
    if (tip.elem2 && (rect2Left - (rectLeft + rectWidth)) + rect2Width + rectWidth > 1000) {
      guideTextWidth = 1070;
    } else if (tip.elem2) {
      guideTextWidth = 700;
    } else if (tip.image) {
      guideTextWidth = 490;
    } else guideTextWidth = 370;
    const rightGap = window.innerWidth - (rectWidth + rectLeft + 60);

    if (rightGap < guideTextWidth && tipPosition === 'right') {
      guideTextWidth = rightGap;
    }

    const guideText = (this.guideText) ? { height: this.guideText.clientHeight } : { height: 0 };
    guideText.width = guideTextWidth;

    let guideTextLeft = (tipPosition === 'bottom') ? this.rectCenter.x - (guideText.width / 2) : rectWidth + rectLeft;

    if (guideTextLeft + guideText.width > window.innerWidth) {
      tipPosition = 'left';
      guideTextLeft = rectLeft - guideText.width;
    }

    const guideTextTop = (tipPosition === 'bottom') ? rectHeight + (rect2Top || rectTop) : this.rectCenter.y - (guideText.height / 2);
    let arrowLeft = 0;
    const arrowTop = (tipPosition === 'bottom') ? guideTextTop : this.rectCenter.y;

    if (tipPosition === 'bottom') {
      if (rect2Left) arrowLeft = this.state.rectLeft + (this.state.rectWidth / 2);
      else arrowLeft = this.rectCenter.x;
    } else if (tipPosition === 'right')arrowLeft = guideTextLeft;
    else if (tipPosition === 'left')arrowLeft = rectLeft;

    if (guideTextLeft < 0) guideTextLeft = 0;

    if (active) {
      return (
        <Dimmer active={active} page className="guide-tour">
          <div className="guide-rect" style={{ width: rectWidth, height: rectHeight, left: rectLeft, top: rectTop }}>
            <div className="topbottom" />
            <div className="leftright" />
          </div>
          { tip.elem2 &&
          <div className="guide-rect" style={{ width: rect2Width, height: rect2Height, left: rect2Left, top: rect2Top }} >
            <div className="topbottom" />
            <div className="leftright" />
          </div>
          }
          <div className={`guide-text-arrow ${tipPosition}`} style={{ left: arrowLeft, top: arrowTop }} />
          { tip.elem2 &&
          <div className={`guide-text-arrow ${tipPosition}`} style={{ left: this.state.rect2Left + (this.state.rect2Width / 2), top: guideTextTop }} />
          }
          <div ref={(node) => { this.guideText = node; }} className={`guide-text ${tipPosition}`} style={{ left: guideTextLeft, top: guideTextTop, width: guideTextWidth }}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={16} className="guide-text-content">
                  { tip.image && <Image src={tip.image} centered /> }
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={tip.title2 ? 6 : 16} className="guide-text-title">{tip.title}</Grid.Column>
                      { tip.title2 && <Grid.Column width={1} className="guide-text-middle">vs.</Grid.Column> }
                      { tip.title2 && <Grid.Column width={9} className="guide-text-title">{tip.title2}</Grid.Column> }
                    </Grid.Row>
                    <Grid.Row className="guide-text-message">
                      <Grid.Column width={tip.text2 ? 6 : 16}>{tip.text}</Grid.Column>
                      { tip.title2 && <Grid.Column width={1} className="guide-text-middle" /> }
                      { tip.title2 && <Grid.Column width={9}>{tip.text2}</Grid.Column> }
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column tablet="6" mobile="6" computer="8" textAlign="right" verticalAlign="middle">
                        {pages[this.props.page].tips.map((item, i) => <span className={`tips-indicator ${i === currentTip ? 'active' : ''}`} key={i} />)}
                      </Grid.Column>
                      <Grid.Column tablet="10" mobile="10" computer="8" textAlign="right" verticalAlign="middle">
                        <Button color="green" size="medium" onClick={this.nextTip} fluid>{ !this.isEnd ? 'Next' : 'Done' }</Button>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </Dimmer>
      );
    }

    return null;
  }
}

function mapStateToProps(state) {
  const profile = state.get('profile');
  return {
    attributes: (profile.get('attributes')) ? profile.get('attributes').toJS() : null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeAttribute: (attribute) => { dispatch(changeAttribute(attribute)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideTour);
