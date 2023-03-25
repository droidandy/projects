// @flow
import withData from 'lib/withData';
import SearchContainer from 'containers/search/SearchContainer';

const SearchPage = props => <SearchContainer {...props} />;

export default withData(SearchPage);
