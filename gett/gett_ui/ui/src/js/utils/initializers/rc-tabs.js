import InkTabs from 'rc-tabs/lib/ScrollableInkTabBar';

// Need this for adding ability to select tab by clicking on next/prev btn
// this methods have additional functionality so we need to prevent it to get correct tabs behavior
InkTabs.prototype['UNSAFE_componentWillMount'] = function() {
  this.next = (e) => {
    this.props.onNextClick(e);
  };
  this.prev = (e) => {
    this.props.onPrevClick(e);
  };
};
