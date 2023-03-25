import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, SectionList, ActivityIndicator } from 'react-native';

import Spinner from 'react-native-spinkit';

import { EmptyLabel, KeyboardAvoidingWrapper } from 'components';

import { withTheme } from 'theme';

import styles from './styles';

class ListView extends PureComponent {
  handleGetItemLayout = (data, index) => {
    const { itemHeight } = this.props;

    return { length: itemHeight, offset: itemHeight * index, index };
  };

  hasItems = () => this.props.items?.length > 0;

  mappingRenderItem = (item, index) => this.props.renderItem({ item, index });

  renderIndicator = () => {
    const { theme } = this.props;

    return (
      <View style={[styles.flex, styles.centered]}>
        <Spinner type="Circle" size={30} color={theme.color.secondaryText} />
      </View>
    );
  };

  renderUnderListIndicator = () => {
    const { theme, bottomIndicatorStyle } = this.props;
    return (
      <View style={[styles.indicatorView, bottomIndicatorStyle]}>
        <ActivityIndicator animating size="small" color={theme.color.secondaryText} />
      </View>
    );
  };

  renderFooter() {
    const { loading, footerComponent, changeableList } = this.props;

    return changeableList && loading && this.hasItems() ? this.renderUnderListIndicator() : footerComponent;
  }

  renderList() {
    const {
      style,
      items,
      typeSections,
      itemHeight,
      listViewRef,
      changeableList,
      contentContainerStyle,
      displayType,
      testID,
      ...rest
    } = this.props;

    const props = {};

    if (typeSections) {
      props.sections = items;
      props.renderSectionHeader = this.props.renderSectionHeader;
    } else {
      props.data = items;
    }

    const Component = typeSections ? SectionList : FlatList;
    const isList = displayType === 'list';

    return (
      <View style={[styles.container, styles.flex]} testID={testID}>
        {isList
          ? items.map(this.mappingRenderItem)
          : (
            <Component
              ref={listViewRef}
              {...props}
              {...rest}
              style={[styles.items, style]}
              ListFooterComponent={this.renderFooter()}
              stickySectionHeadersEnabled={false}
              getItemLayout={itemHeight ? this.handleGetItemLayout : null}
              contentContainerStyle={[changeableList && styles.contentContainer, contentContainerStyle]}
            />
          )
        }
      </View>
    );
  }

  renderEmptyLabel() {
    const { emptyLabel, showEmptyLabel, hideEmptyIcon } = this.props;
    return showEmptyLabel && <EmptyLabel type={emptyLabel} hideEmptyIcon={hideEmptyIcon} />;
  }

  render() {
    const { loading, listViewStyle, changeableList, disableAvoiding } = this.props;

    return (
      <KeyboardAvoidingWrapper
        style={[styles.flex, styles.centered, listViewStyle]}
        keyboardVerticalOffset={80}
        disableAvoiding={disableAvoiding}
      >
        {this.hasItems() || loading
          ? this.renderList()
          : this.renderEmptyLabel()
        }
        {loading && !this.hasItems() && changeableList && this.renderIndicator()}
      </KeyboardAvoidingWrapper>
    );
  }
}

ListView.propTypes = {
  bottomIndicatorStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  changeableList: PropTypes.bool,
  contentContainerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  data: PropTypes.array,
  disableAvoiding: PropTypes.bool,
  displayType: PropTypes.oneOf(['scrollList', 'list']),
  emptyLabel: PropTypes.string,
  footerComponent: PropTypes.node,
  hideEmptyIcon: PropTypes.bool,
  itemHeight: PropTypes.number,
  items: PropTypes.array.isRequired,
  keyExtractor: PropTypes.func,
  listViewRef: PropTypes.func,
  listViewStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  loading: PropTypes.bool,
  onEndReached: PropTypes.func,
  renderItem: PropTypes.func.isRequired,
  renderSectionHeader: PropTypes.func,
  sections: PropTypes.array,
  showEmptyLabel: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  testID: PropTypes.string,
  theme: PropTypes.object,
  typeSections: PropTypes.bool.isRequired
};

ListView.defaultProps = {
  changeableList: true,
  disableAvoiding: false,
  displayType: 'scrollList',
  footerComponent: null,
  hideEmptyIcon: false,
  itemHeight: 0,
  keyExtractor: item => String(item.id),
  listViewStyle: undefined,
  loading: false,
  onEndReached: undefined,
  showEmptyLabel: true
};

export default withTheme(ListView);
