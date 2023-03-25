import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image
} from 'react-native';
import AppIntro from 'react-native-app-intro';
import LinearGradient from 'react-native-linear-gradient';
import imagesApp from '../constants/Images';

const windowsWidth = Dimensions.get('window').width;
const windowsHeight = Dimensions.get('window').height;

const imageWidth = (windowsWidth / 2);
class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
    onSkipBtnHandle = (index) => {
        const { navigation, setFirstLaunch } = this.props;
        setFirstLaunch();
        // navigation.navigate('Home', {});
        // console.log('Skip', index);
    };
    doneBtnHandle = () => {
        const { navigation, setFirstLaunch } = this.props;
        setFirstLaunch();
        // navigation.navigate('Home', {});
        // console.log('Done');
    };
    nextBtnHandle = (index) => {
        // console.log('Next', index);
    };
    onSlideChangeHandle = (index, total) => {
        // console.log(index, total);
    };

  render() {
    return (
      <View >
        <AppIntro
            customStyles={{
                paginationContainer: {
                    top: 25,
                    height: 50,
                    width: '100%'
                },
                dotContainer: {
                    flex: 0.40,
                },
                btnContainer: {
                    flex: 0.3,
                }
            }}
            dotColor={'rgba(221,221,221,.99)'}
            activeDotColor={'#000'}
            rightTextColor={'#000'}
            leftTextColor={'#000'}
            onNextBtnClick={this.nextBtnHandle}
            onDoneBtnClick={this.doneBtnHandle}
            onSkipBtnClick={this.onSkipBtnHandle}
            onSlideChange={this.onSlideChangeHandle}
        >
          <View style={[styles.slide]}>
              <View style={[styles.half_slide, { backgroundColor: '#fff' }]}>
                  <View level={10}>
                      <Image
                          style={{width: imageWidth, height: imageWidth * 0.6728 }}
                          source={imagesApp.searchBarIcon}
                          resizeMode="cover"
                      />
                  </View>
                  <View level={15}><Text style={styles.text}>Search for a specific car</Text></View>
              </View>
              <LinearGradient style={[styles.bottom_slide]} colors={['#20C8D4', '#12D6CC', '#21E9CB']} >
                  <View level={8} style={[styles.view_slide]}>
                      <Text style={styles.text_bottom}>You want options, right?</Text>
                      <Text style={styles.text_bottom_small}>When you choose to search by</Text>
                      <Text style={styles.text_bottom_small}>make and model, we'll also</Text>
                      <Text style={styles.text_bottom_small}>give you a couple of nice</Text>
                      <Text style={styles.text_bottom_small}>alternatives using our</Text>
                      <Text style={styles.text_bottom_small}>matching algorithm</Text>
                  </View>
              </LinearGradient>
          </View>
          <View style={[styles.slide, { backgroundColor: '#a4b602' }]}>
              <View style={[styles.half_slide,{ backgroundColor: '#fff' }]}>
                  <View level={-10}>
                      <Image
                          style={{width: imageWidth, height: imageWidth*0.6728}}
                          source={imagesApp.carIcon}
                          resizeMode="cover"
                      />
                  </View>
                  <View level={5}><Text style={styles.text}>Search by vehicle type</Text></View>
              </View>
              <LinearGradient style={[styles.bottom_slide]} colors={['#F0563C', '#F78A52', '#FCB162']} >
                  <View level={8} style={[styles.view_slide]}>
                      <Text style={styles.text_bottom}>Not sure what you want?</Text>
                      <Text style={styles.text_bottom_small}>Search by our unique body</Text>
                      <Text style={styles.text_bottom_small}>classifications</Text>
                  </View>
              </LinearGradient>
          </View>
          <View style={[styles.slide,{ backgroundColor: '#fa931d' }]}>
              <View style={[styles.half_slide,{ backgroundColor: '#fff' }]}>
                  <View level={8}>
                      <Image
                          style={{width: imageWidth, height: imageWidth*0.6878}}
                          source={imagesApp.tagIcon}
                          resizeMode="cover"
                      />
                  </View>
                  <View level={0}><Text style={styles.text}>Sort your results in a meaningful way</Text></View>
              </View>
              <LinearGradient style={[styles.bottom_slide]} colors={['#9776BB', '#C290D0', '#E8A7E2']} >
                  <View level={20} style={[styles.view_slide]}>
                      <Text style={styles.text_bottom}>Tag it Up</Text>
                      <Text style={styles.text_bottom_small}>Use our cutting edge sorting system</Text>
                      <Text style={styles.text_bottom_small}>to choose the features you want</Text>
                      <Text style={styles.text_bottom_small}>and the best matching vehicles</Text>
                      <Text style={styles.text_bottom_small}>will be shown up top</Text>

                  </View>
              </LinearGradient>
          </View>
        </AppIntro>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    slide: {
        display: 'flex',
        flex: 1,
        height: '100%',
        backgroundColor: 'transparent',
    },
    bottom_slide: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    half_slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 15,
    },
    view_slide: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 15,
    },
    text_top: {
        color: '#000',
        fontSize: 22,
    },
    text: {
        color: '#000',
        fontSize: 17,
    },
    text_bottom: {
        color: '#fff',
        fontSize: 22,
    },
    text_bottom_small: {
        color: '#fff',
        fontSize: 17,
    },
});

export default Intro;
