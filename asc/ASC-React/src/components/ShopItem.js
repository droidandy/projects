import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import * as registerActions from '../redux/register';
import {
  Fab,
  Dialog,
  Icon
  // Page
} from 'react-onsenui';

import Lightbox from 'react-images';
import commonUtils from '../utils/commonUtils';

import {PhotoSwipe} from 'react-photoswipe';

import staticImages from '../staticImages';

// import SplitterButton from './Button';

// import PhraseBox from './PhraseBox';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, auth: state.auth, register: state.register, utility: state.utility }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions, ...registerActions}, dispatch) }))

class ShopItem extends React.Component {
  constructor(props) {
    super(props);
    // this.renderBottomToolbar = this.renderBottomToolbar.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.gotoImage = this.gotoImage.bind(this);
    this.handleClickImage = this.handleClickImage.bind(this);

    this.state = {
      data: [{ src: staticImages.lorempixel1 }, { src: staticImages.lorempixel2 }, { src: staticImages.lorempixel3 }, { src: staticImages.lorempixel4 }, { src: staticImages.lorempixel5 }],
      currentImage: 1,
      showImg: false,

      options: {},
      items: [
        {
          src: staticImages.lorempixel1,
          w: 400,
          h: 200,
          title: 'Image 1'
        },
        {
          src: staticImages.lorempixel2,
          w: 400,
          h: 200,
          title: 'Image 2'
        },
        {
          src: staticImages.lorempixel3,
          w: 400,
          h: 200,
          title: 'Image 3'
        },
        {
          src: staticImages.lorempixel4,
          w: 400,
          h: 200,
          title: 'Image 4'
        },
        {
          src: staticImages.lorempixel5,
          w: 400,
          h: 200,
          title: 'Image 5'
        }
      ]

    };
  }

  closeLightbox() {
    this.setState({
      // currentImage: 0,
      showImg: false
    });
  }

  gotoPrevious() {
    console.log('prev');
    this.setState({
      currentImage: this.state.currentImage - 1
    });
  }

  gotoNext() {
    console.log('next');
    this.setState({
      currentImage: this.state.currentImage + 1
    });
  }

  gotoImage(index) {
    this.setState({
      currentImage: index
    });
  }

  handleClickImage() {
    if (this.state.currentImage === 4) return;

    this.gotoNext();
  }

  render() {
    console.log(PhotoSwipe, Lightbox, commonUtils);

    // if (this.state.showImg && this.props.utility.isDevice) {
    // // show single pic by cordova plugin
    //   window.PhotoViewer.show('http://lorempixel.com/400/200/', 'Optional Title', {share: false});
    // }
    // // paste in config.xml <plugin name="com-sarriaroman-photoviewer" spec="~1.1.8" />

    return (
      <div>

        {
          this.state.showImg
          // this part isn't finished =(
          // add swipes from 'react-touch'
          //
          //
          // ? <PhotoSwipe isOpen={this.state.showImg}
          //     items={this.state.items}
          //     options={this.state.options}
          //     onClose={this.handleClose}/>
          ? !this.props.utility.isDevice
            ? <Lightbox
                images={this.state.data}
                isOpen={this.state.showImg}
                currentImage={this.state.currentImage}
                showThumbnails
                onClickImage={this.handleClickImage}
                onClickNext={this.gotoNext}
                onClickPrev={this.gotoPrevious}
                onClickThumbnail={this.gotoImage}
                onClose={this.closeLightbox}
                />
            : <Dialog
              isOpen={this.state.showImg}
              isCancelable={false}
              onCancel={() => { this.setState({showImg: false}); }}>
              <div>
                <img src={this.state.data[this.state.currentImage].src}/>
                {/* <div
                  style={{color: commonUtils.isAndroid() ? '#fff' : null}}
                  className='alert-dialog-content' >
                    Email has not been finded.
                </div>*/}
                <div className='alert-dialog-footer'>
                    <button onClick={() => { this.setState({showImg: false}); }} className='alert-dialog-button'>
                        OK
                    </button>
                </div>
              </div>
            </Dialog>
          : null
        }

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>

          <div onClick={() => { this.setState({showImg: true}); }}
            style={{
              backgroundImage: `url(${this.state.data[this.state.currentImage].src})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '50%',
              width: '100%', height: '80vmin', minHeight: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', fontSize: '20px', lineHeight: '25px', color: '#999999'
            }} >

            <div style={{margin: 'auto auto 5px 5px', padding: '4px 8px', backgroundColor: '#818181', borderRadius: '5px', color: '#fff'}}>{this.state.currentImage + 1} of {this.state.data.length}</div>
          </div>

          <Fab style={{margin: '-28px 10px 0 auto', backgroundColor: '#9e1c26'}} ripple onClick={() => { console.log('Add to cart click'); }}>
            <Icon icon='md-plus'/>
            <Icon icon='md-shopping-cart' />
          </Fab>

          <div style={{backgroundColor: '#30322F', color: '#fff', alignSelf: 'stretch', minHeight: '100px', marginTop: '-28px', paddingBottom: '20px', borderBottom: '1px solid rgba(0, 0, 0, 0.5)'}}>
            <div style={{padding: '30px 0 0 15px', fontSize: '35px', fontWeight: '600'}}>Item Name</div>
            <div style={{paddingLeft: '15px', fontSize: '30px'}}>$99.-</div>
          </div>

          <div style={{backgroundColor: '#30322F', color: '#fff', alignSelf: 'stretch', padding: '15px'}}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </div>

        </div>
      </div>
    );
  }
}

export default ShopItem;
