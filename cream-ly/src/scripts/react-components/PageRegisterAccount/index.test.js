import PageRegisterAccount from ".";
import * as Stories from "./index.stories";
import { globalDecorator } from "../../../../.storybook/preview";

describe("<PageRegisterAccount />", () => {
  beforeEach(() => {});

  it("renders defaultState", async () => {
    const wrapper = mount(globalDecorator(Stories.defaultState));
  });

  it("renders error", async () => {
    const wrapper = mount(globalDecorator(Stories.error));
  });

  it("renders loading", async () => {
    const wrapper = mount(globalDecorator(Stories.loading));
  });

  it("renders complete", async () => {
    const wrapper = mount(globalDecorator(Stories.complete));
  });
});
