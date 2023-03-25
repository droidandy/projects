import * as action from "./show_video_results";

const sharedProps = {};
describe("recuder - show_video_results", () => {
  beforeEach(() => {});

  it("returns one video when goal is edema", async () => {
    const selectedGoals = ["edema"];
    const videos = await action.default(selectedGoals);

    expect(videos.length).toBe(5);
    expect(videos[0]).toBe("video-2-limfa");
  });

  it("returns nothing when no goals selected", async () => {
    const selectedGoals = [];
    const videos = await action.default(selectedGoals);

    expect(videos.length).toBe(0);
  });
});
