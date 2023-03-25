import Quiz from "./index";

const clickSkinType = (skinType, wrapper) => {
  wrapper
    .find(`[data-option-group="skinType"][data-option-value="${skinType}"]`)
    .simulate("click");
};
const clickSkinGoal = (goal, wrapper) => {
  wrapper.find(`[data-option-value="${goal}"]`).simulate("click");
};
const clickComplete = (wrapper) => {
  wrapper.find('[data-test="linkRecommendations"]').simulate("click");
};
let sharedProps = {};
describe.skip("<Quiz />", () => {
  beforeEach(() => {
    sharedProps = {
      isScrollOff: true,
      onError: jest.fn(),
      onComplete: jest.fn(),
    };
  });

  it("renders and finds button and options", async () => {
    const props = {
      isScrollOff: true,
    };
    const wrapper = mount(<Quiz {...props} />);
    expect(wrapper.find('[data-test="linkRecommendations"]')).toHaveLength(1);
    expect(wrapper.find('[data-option-group="skinType"]')).toHaveLength(4);
  });

  it("emits error event when nothing selected", async () => {
    const props = {
      isScrollOff: true,
      onError: jest.fn(),
    };

    const wrapper = mount(<Quiz {...props} />);
    clickComplete(wrapper);

    expect(props.onError.mock.calls).toHaveLength(1);
  });

  it("completes quiz when select normal skin and wrinkles", async () => {
    const props = sharedProps;
    const wrapper = mount(<Quiz {...props} />);
    clickSkinType("normal", wrapper);
    clickSkinGoal("wrinkles", wrapper);
    clickComplete(wrapper);

    expect(props.onError.mock.calls).toHaveLength(0);
    expect(props.onComplete.mock.calls).toHaveLength(1);

    const onCompleteResponse = props.onComplete.mock.calls[0][0];
    expect(onCompleteResponse.skinGoals).toStrictEqual(["wrinkles"]);
    expect(onCompleteResponse.skinType).toStrictEqual("normal");
  });

  it("emits error when unselect prefilled goal", async () => {
    const props = {
      ...sharedProps,
      skinType: "normal",
      skinGoals: ["wrinkles"],
    };

    const wrapper = mount(<Quiz {...props} />);
    clickSkinGoal("wrinkles", wrapper);
    clickComplete(wrapper);

    expect(props.onError.mock.calls).toHaveLength(1);
    expect(props.onComplete.mock.calls).toHaveLength(0);
  });

  it("completes with change to preffiled skinGoals", async () => {
    const props = {
      ...sharedProps,
      skinType: "normal",
      skinGoals: ["wrinkles", "edema"],
    };

    const wrapper = mount(<Quiz {...props} />);
    clickSkinGoal("wrinkles", wrapper);
    clickSkinGoal("edema", wrapper);
    clickSkinGoal("neck_wrinkles", wrapper);
    clickSkinGoal("body", wrapper);
    clickSkinGoal("acne", wrapper);
    clickComplete(wrapper);

    expect(props.onError.mock.calls).toHaveLength(0);
    expect(props.onComplete.mock.calls).toHaveLength(1);

    const onCompleteResponse = props.onComplete.mock.calls[0][0];
    expect(onCompleteResponse.skinGoals).toStrictEqual([
      "neck_wrinkles",
      "body",
      "acne",
    ]);
  });
});
