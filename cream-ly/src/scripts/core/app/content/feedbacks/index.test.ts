import getFeedbacks from ".";

describe("localization", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("works in RU", async () => {
    const feedbacks = getFeedbacks();
    expect(Array.isArray(feedbacks)).toBe(true);
    expect(feedbacks.length > 0).toBe(true);
  });

  it("works in EN", async () => {
    const feedbacks = getFeedbacks("en");

    expect(Array.isArray(feedbacks)).toBe(true);
    expect(feedbacks.length > 0).toBe(true);
  });
});
