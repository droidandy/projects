//@ts-nocheck
import * as stories from "./index.stories";
import { globalDecorator } from "../../../../../.storybook/preview";

import { mount } from "enzyme";

describe("<CustomerPageVideo />", () => {
  beforeEach(() => {});

  it("", async () => {
    const wrapper = mount(globalDecorator(stories.hasAccessVideo1));
  });
  it("", async () => {
    const wrapper = mount(
      globalDecorator(stories.hasAccessVideo2Part2Selected)
    );
  });
  it.skip("", async () => {
    const wrapper = mount(globalDecorator(stories.noAccess));
  });
  it("", async () => {
    const wrapper = mount(globalDecorator(stories.notLogin));
  });
});
