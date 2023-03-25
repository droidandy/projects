import VideosFilter from "./index";

const selectorButton = '[data-test="buttonVideosFilter"]';
const slectorBubbleGoal = '[data-option-group="skinGoals2"]';

const selectGoal = (goal, wrapper) => {
  wrapper
    .find(slectorBubbleGoal)
    .find(`[data-option-value="${goal}"]`)
    .simulate("click");
};
const clickComplete = (wrapper) => {
  wrapper.find(selectorButton).simulate("click");
};
let sharedProps = {};
describe.skip("<VideosFilter />", () => {
  beforeEach(() => {
    sharedProps = {
      productHandle: "cream-my-skin",
      isScrollOff: true,
      onError: jest.fn(),
      onComplete: jest.fn(),
    };
  });

  it("renders and finds button and options", async () => {
    const wrapper = mount(<VideosFilter {...sharedProps} />);
    expect(wrapper.find(slectorBubbleGoal)).toHaveLength(5);
    expect(wrapper.find(selectorButton)).toHaveLength(1);
  });

  it("emits error event when nothing selected", async () => {
    const wrapper = mount(<VideosFilter {...sharedProps} />);
    clickComplete(wrapper);

    expect(sharedProps.onError.mock.calls).toHaveLength(1);
    expect(sharedProps.onComplete.mock.calls).toHaveLength(0);
  });

  it("completes quiz when select goal", async () => {
    const wrapper = mount(<VideosFilter {...sharedProps} />);
    selectGoal("edema", wrapper);
    selectGoal("breast_shape", wrapper);
    clickComplete(wrapper);

    expect(sharedProps.onError.mock.calls).toHaveLength(0);
    expect(sharedProps.onComplete.mock.calls).toHaveLength(1);

    // console.log(JSON.stringify(sharedProps.onComplete.mock.calls));

    const onCompleteResponse = sharedProps.onComplete.mock.calls[0][0];
    expect(onCompleteResponse).toStrictEqual(["edema", "breast_shape"]);
  });

  /*
  it("completes quiz when props data is assigned as default values", async () => {
    const props = {
      ...sharedProps,
      skinType: "normal",
      goals: ["wrinkles"]
    };

    const wrapper = mount(<VideosFilter {...props} />);
    clickComplete(wrapper);

    expect(sharedProps.onError.mock.calls).toHaveLength(0);
    expect(sharedProps.onComplete.mock.calls).toHaveLength(1);

    const onCompleteResponse = sharedProps.onComplete.mock.calls[0];
    expect(onCompleteResponse[1]).toStrictEqual("normal");
    expect(onCompleteResponse[2]).toStrictEqual(["wrinkles"]);
  }); */
});
