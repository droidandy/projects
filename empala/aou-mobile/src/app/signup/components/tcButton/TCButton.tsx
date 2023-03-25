import * as WebBrowser from 'expo-web-browser';
import React from 'react';

import * as s from './TCButton.styles';

import { Urls } from '~/constants/endpoints';
import { colors } from '~/theme/colors';

const gotoTC = (url: string) => {
  WebBrowser.openBrowserAsync(url, {
    controlsColor: colors.White,
    toolbarColor: colors.BrandBlue600,
  }).catch(() => {});
};

export const TCButton = (): JSX.Element => (
  <s.Container>
    <s.Text>By signing up, you’re agreeing to our </s.Text>
    <s.Link onPress={() => gotoTC(Urls.tesmsOfService)}>Terms of Service</s.Link>
    <s.Text> and </s.Text>
    <s.Link onPress={() => gotoTC(Urls.privacyPolicy)}>Privacy Policy</s.Link>
    <s.Link>.</s.Link>
  </s.Container>
);
