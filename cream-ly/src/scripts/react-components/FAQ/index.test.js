//ts-nocheck
//import FAQ from ".";
import { globalDecorator } from "../../../../.storybook/preview";
import { mount } from "enzyme";

/* const mountComponent = (props) => {
  return mount(globalDecorator(() => <FAQ {...props} />));
}; */
describe("<FAQ />", () => {
  it.skip("works", async () => {
    mountComponent();
  });
});
