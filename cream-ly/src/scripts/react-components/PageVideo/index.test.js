import PageVideo from "./index";
import * as Stories from "./index.stories";
import { globalDecorator } from "../../../../.storybook/preview";

import { mount } from "enzyme";

describe("<PageVideo />", () => {
  beforeEach(() => {});

  it("renders defaultPage story", async () => {
    const wrapper = mount(globalDecorator(Stories.defaultPage));

    // expect(wrapper.find('[data-test="feedbacks-component"]').exists()).toBe(
    //   true
    // );
    expect(wrapper.find('[data-test="recommended-video-block"]').exists()).toBe(
      false
    );
    expect(wrapper.find('[data-test="purchased-video-badge"]').exists()).toBe(
      false
    );
  });

  it("renders WithRecommendedVideos story", async () => {
    const wrapper = mount(globalDecorator(Stories.WithRecommendedVideos));

    // expect(wrapper.find('[data-test="feedbacks-component"]').exists()).toBe(
    //   true
    // );
    expect(wrapper.find('[data-test="recommended-video-block"]').exists()).toBe(
      true
    );
    expect(wrapper.find('[data-test="purchased-video-badge"]').exists()).toBe(
      false
    );
  });

  it("renders CustomerPurchasedVideo story", async () => {
    const wrapper = mount(globalDecorator(Stories.CustomerPurchasedVideo));

    expect(wrapper.find('[data-test="purchased-video-badge"]').exists()).toBe(
      true
    );
  });

  it("renders noFeedback story", async () => {
    const wrapper = mount(globalDecorator(Stories.noFeedback));

    // expect(wrapper.find('[data-test="feedbacks-component"]').exists()).toBe(
    //   false
    // );
    expect(wrapper.find('[data-test="recommended-video-block"]').exists()).toBe(
      false
    );
    expect(wrapper.find('[data-test="purchased-video-badge"]').exists()).toBe(
      false
    );
  });
});
