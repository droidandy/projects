import * as videos from "./videos";

describe("redux/customer/videos", () => {
  it("get handles from orders list", () => {
    const orders = [
      {
        items: [
          { product: { handle: "video-1" } },
          { product: { handle: "video-aging" } },
        ],
      },
    ];
    const result = videos.getHandlesFromOrders(orders);
    expect(result).toStrictEqual(["video-1", "video-aging"]);
  });

  it("filter out non-video handles", () => {
    const handles = ["flower-powder", "video-1", "cream-my-skin"];
    const result = videos.filterVideoHandles(handles);
    expect(result).toStrictEqual(["video-1"]);
  });

  it("get handles from orders and tags", () => {
    const orders = [
      {
        items: [
          { product: { handle: "video-1" } },
          { product: { handle: "video-aging" } },
          { product: { handle: "cream-my-skin" } },
        ],
      },
    ];

    const tags = ["video-massage-level1", "video-massage-level3"];

    const customer = { orders, tags };

    const result = videos.default(customer);
    expect(result).toStrictEqual(["video-1", "video-aging", "video-3-osanka"]);
  });
});
