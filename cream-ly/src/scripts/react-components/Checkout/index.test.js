import * as Story from "./index.stories";
import { globalDecorator } from "../../../../.storybook/preview";

const findNextButton = (wrapper) => {
  return wrapper.find('[data-test="button-step-forward"]');
};

describe("<Checkout />", () => {
  it.skip("physical", async () => {
    const wrapper = mount(Story.physical());

    expect(wrapper.state("step")).toBe(1);
    expect(wrapper.state("isLoadingInProgress")).toBe(false);

    //проверяем что есть кнопка вперед
    expect(findNextButton(wrapper).props().children).toBe("nextStep text");
    findNextButton(wrapper).simulate("click");
    //console.log(wrapper.debug());

    expect(wrapper.state("isLoadingInProgress")).toBe(true);

    //expect(wrapper.state().isLoadingInProgress).toBe(true);
  });
});
