/**
 * Created by 1 on 05.12.2015.
 */
import React, { Component } from "react";
import { connect } from 'react-redux';
import f7Components from "./f7/components.js";
import Menu from "./menu/menu.js";
import menuItems from "./menu/menu-items.js";
import MakeMap from "./make-map/container.js";
import ReadName from "./read-name/container.js";
import CapitalsTest from "./capitals-test/container.js";
import StopGameBack from "./btn/container.js";
import HelpButton from "./btn/help-btn.js";
import Button from "./btn/btn.js";
import Splash from "./splash";

const {
  NavBar,
  NavBarsContainer,
  NavButton,
  Page,
  StatusBarOverlay,
  ViewsContainer,
  View,
  NavTitle,
  PagesContainer,
  AppContainer
} = f7Components;

import regions from "./../content/regions.js";
import { words, LN } from "./../words.js";

@connect((state) => ({questions: state.test}))
export default class Root extends Component {
  render() {
    const { questions } = this.props;
    return (
      <AppContainer>
        <audio src="audio/win.wav" id="audio_win"  style={{display: "none"}}/>
        <audio src="audio/correct.wav" id="audio_correct"  style={{display: "none"}}/>
        <audio src="audio/incorrect.wav" id="audio_incorrect" style={{display: "none"}}/>
        <Splash />
        <ViewsContainer>
          <View viewName="view-main">
            <NavBarsContainer>

              <NavBar page="index">
                <NavTitle mode="sliding">{words.app_name[LN]}</NavTitle>
              </NavBar>

              <NavBar page="make-map" classList="cached">
                <NavButton side="left">
                  <StopGameBack classList={["m-btn"]} type="make-map">{words.exit[LN]}</StopGameBack>
                </NavButton>
                <NavTitle mode="sliding">{words.makeMap[LN]}</NavTitle>
              </NavBar>

              <NavBar page="read-name" classList="cached">
                <NavButton side="left">
                  <Button classList={["m-btn", "back"]}>{words.exit[LN]}</Button>
                </NavButton>
                <NavTitle mode="sliding">{words.readName[LN]}</NavTitle>
              </NavBar>

              <NavBar page="capitals-test" classList="cached">
                <NavButton side="left">
                  <Button classList={["m-btn", "back"]} onClick={() => this.refs.test.startAgain()}>{words.exit[LN]}</Button>
                </NavButton>
                <NavTitle mode="sliding">{words.capitals[LN]}</NavTitle>
              </NavBar>

              <NavBar page="put-names" classList="cached">
                <NavButton side="left">
                  <StopGameBack classList={["m-btn"]} type="put-names">{words.exit[LN]}</StopGameBack>
                </NavButton>
                <NavTitle mode="sliding">{words.putName[LN]}</NavTitle>
              </NavBar>

            </NavBarsContainer>

            <PagesContainer mode="navbar-through">

              <Page page="index">
                <Menu menuItems={menuItems} />
              </Page>

              <Page page="make-map" classList="cached">
                <MakeMap type="make-map"/>
              </Page>

              <Page page="read-name" classList="cached">
                <ReadName regions={regions} />
              </Page>

              <Page page="capitals-test" classList="cached" contentClasses={["test"]}>
                <CapitalsTest questions={questions} ref="test"/>
              </Page>

              <Page page="put-names" classList="cached" >
                <MakeMap type="put-names"/>
              </Page>

            </PagesContainer>

          </View>
        </ViewsContainer>
      </AppContainer>
    );
  }
};
