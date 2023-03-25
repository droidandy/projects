import ProductQuiz from "./index";

const selectorButton = '[data-test="buttonProductQuizSubmit"]';
const selectorSelectSkinType = '[data-quiz-question="skinType"]';
const selectorLabelSkinGoals = '[data-quiz-question="skinGoals"]';

const selectSkinType = (skinType, wrapper) => {
  wrapper
    .find(`${selectorSelectSkinType}[value="${skinType}"]`)
    .simulate("change", { target: { value: skinType } });
};
const selectSkinGoal = (goal, wrapper) => {
  wrapper
    .find(selectorLabelSkinGoals)
    .find(`[data-quiz-value="${goal}"] input`)
    .simulate("change", { target: { value: goal } });
};
const clickComplete = (wrapper) => {
  wrapper.find(selectorButton).simulate("click");
};
let sharedProps = {};
describe.skip("<ProductQuiz />", () => {
  beforeEach(() => {
    sharedProps = {
      productHandle: "cream-my-skin",
      isScrollOff: true,
      onError: jest.fn(),
      onComplete: jest.fn(),
    };
  });

  it("renders and finds button and options", async () => {
    const wrapper = mount(<ProductQuiz {...sharedProps} />);
    expect(wrapper.find(selectorSelectSkinType)).toHaveLength(4);
    expect(wrapper.find(selectorLabelSkinGoals)).toHaveLength(6);
    expect(wrapper.find(selectorButton)).toHaveLength(1);
  });

  it("emits error event when nothing selected", async () => {
    const wrapper = mount(<ProductQuiz {...sharedProps} />);
    clickComplete(wrapper);

    expect(sharedProps.onError.mock.calls).toHaveLength(1);
    expect(sharedProps.onComplete.mock.calls).toHaveLength(0);
  });

  it("emits error event when skin goal is selected but skinType is not ", async () => {
    const wrapper = mount(<ProductQuiz {...sharedProps} />);
    selectSkinGoal("acne", wrapper);
    clickComplete(wrapper);

    expect(sharedProps.onError.mock.calls).toHaveLength(1);
    expect(sharedProps.onComplete.mock.calls).toHaveLength(0);
  });

  it("emits error event when skin type is selected but skinGoal is not ", async () => {
    const wrapper = mount(<ProductQuiz {...sharedProps} />);
    selectSkinType("normal", wrapper);
    clickComplete(wrapper);

    expect(sharedProps.onError.mock.calls).toHaveLength(1);
    expect(sharedProps.onComplete.mock.calls).toHaveLength(0);
  });

  it("emits error event when skin goal provided for video, not product ", async () => {
    const props = {
      ...sharedProps,
      skinType: "normal",
      goals: ["edema"],
    };

    const wrapper = mount(<ProductQuiz {...props} />);
    clickComplete(wrapper);

    expect(sharedProps.onError.mock.calls).toHaveLength(1);
    expect(sharedProps.onComplete.mock.calls).toHaveLength(0);
  });

  it("completes quiz when select normal skin and wrinkles", async () => {
    const wrapper = mount(<ProductQuiz {...sharedProps} />);
    selectSkinType("normal", wrapper);
    selectSkinGoal("wrinkles", wrapper);
    clickComplete(wrapper);

    expect(sharedProps.onError.mock.calls).toHaveLength(0);
    expect(sharedProps.onComplete.mock.calls).toHaveLength(1);

    const onCompleteResponse = sharedProps.onComplete.mock.calls[0];
    expect(onCompleteResponse[1]).toStrictEqual("normal");
    expect(onCompleteResponse[2]).toStrictEqual(["wrinkles"]);
  });

  it("completes quiz when props data is assigned as default values", async () => {
    const props = {
      ...sharedProps,
      skinType: "normal",
      goals: ["wrinkles"],
    };

    const wrapper = mount(<ProductQuiz {...props} />);
    clickComplete(wrapper);

    expect(sharedProps.onError.mock.calls).toHaveLength(0);
    expect(sharedProps.onComplete.mock.calls).toHaveLength(1);

    const onCompleteResponse = sharedProps.onComplete.mock.calls[0];
    expect(onCompleteResponse[1]).toStrictEqual("normal");
    expect(onCompleteResponse[2]).toStrictEqual(["wrinkles"]);
  });
});
