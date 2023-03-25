import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import FeedbackModal from '../FeedbackModal/FeedbackModal';
configure({ adapter: new Adapter() });

describe('<FeedbackModal />', () => {
  it('should render the Modal', () => {
    const renderedComponent = shallow(
      <FeedbackModal
        open={false}
        sendFeedback={() => {}}
        closeModal={() => {}}
      />
    );
    expect(renderedComponent.find('.feedback-modal').length).toBe(1);
  });
});
