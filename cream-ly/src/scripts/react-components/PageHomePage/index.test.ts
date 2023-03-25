import { mount } from "enzyme";
import * as Stories from "./index.stories";
import { globalDecorator } from "../../../../.storybook/preview";

const isFreeVideoDisplayed = (wrapper) => {
  const selector = ".HomeFreeVideo";
  return wrapper.find(selector).exists();
};

const isQuizResultLink = (wrapper) => {
  const selector = '[data-test="linkQuizResults"]';
  return wrapper.find(selector).exists();
};

describe("<PageHomePage />", () => {
  beforeEach(() => {});

  it("renders defaultPage story", async () => {
    const wrapper = mount(globalDecorator(Stories.defaultPage));
    expect(isQuizResultLink(wrapper)).toBe(false);
  });
});
