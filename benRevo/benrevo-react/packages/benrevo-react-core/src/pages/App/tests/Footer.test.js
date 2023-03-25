import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import Footer from '../Footer/index';
import messages from '../Footer/messages';
configure({ adapter: new Adapter() });

describe('<Footer />', () => {
  it('should render the copyright notice', () => {
    const renderedComponent = shallow(
      <Footer />
    );
    expect(renderedComponent.contains(
      <FormattedMessage {...messages.licenseMessage} />
    )).toBe(true);
  });

  it('should render the contact us', () => {
    const renderedComponent = shallow(<Footer />);
    expect(renderedComponent.contains(
      <FormattedMessage {...messages.contactUs} />
    )).toBe(true);
  });
});
