import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { strings } from 'locales';
import { Popup } from 'components';

const styles = StyleSheet.create({
  popupLocationTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginHorizontal: 0,
    marginBottom: 0
  },
  popupCards: {
    textAlign: 'center',
    marginVertical: 8,
    marginHorizontal: 5
  }
});

const CardsPopup = ({ innerRef }) => (
  <Popup
    innerRef={innerRef}
    titleStyle={styles.popupLocationTitle}
    title={strings('popup.cards.title')}
    contentStyle={styles.popupCards}
    content={strings('popup.cards.description')}
  />
);

CardsPopup.propTypes = {
  innerRef: PropTypes.func
};

export default CardsPopup;
