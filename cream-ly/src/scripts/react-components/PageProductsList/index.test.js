import * as Stories from "./index.stories";
import { globalDecorator } from "../../../../.storybook/preview";

describe("<PageProductsList />", () => {
  it("defaultPage", async () => {
    const wrapper = mount(globalDecorator(Stories.defaultPage));

    //expect(wrapper.find(".Product").length).toBe(12);
  });

  it("recommendedProducts", async () => {
    const wrapper = mount(globalDecorator(Stories.recommendedProducts));

    /*  expect(
      wrapper
        .find(".Product")
        .at(0)
        .find(".badge")
        .props().children
    ).toBe("Рекомендованный вам продукт"); */
  });
});
