import { CustomerStateShape, Order } from "./shape.ts";
import { getVideosList } from "../../products/video";

/**
 * @param {CustomerStateShape} customer
 */
export default (customer) => {
  if (!customer) return [];

  const purchasedHandles = customer.orders
    ? filterVideoHandles(getHandlesFromOrders(customer.orders))
    : [];

  const handlesFromTags = customer.tags
    ? customer.tags.map((tag) => customerTagToVideo(tag))
    : [];

  const combinedHandles = [...purchasedHandles, ...handlesFromTags];

  const removedDuplicates = combinedHandles.filter(
    (item, pos, self) => self.indexOf(item) == pos
  );

  return removedDuplicates;
};

/**
 * @param  {Array.<Order>} orders
 */
export const getHandlesFromOrders = (orders) => {
  if (!orders || !Array.isArray(orders)) return [];

  return orders.reduce((acc, order) => {
    let handles = [];
    if (Array.isArray(order.items))
      handles = order.items
        .filter((item) => item.product && item.product.handle)
        .map((item) => item.product.handle);

    return [...acc, ...handles];
  }, []);
};

export const filterVideoHandles = (handlesList) => {
  if (!handlesList) return [];

  const videosHandles = getVideosList().map((video) => video.handle);
  const list = handlesList.filter((handle) => videosHandles.includes(handle));

  return list;
};

export const customerTagToVideo = (tag) => {
  switch (tag) {
    case "video-massage-level0":
      return "video-aging";

    case "video-massage-level1":
      return "video-1";

    case "video-massage-level2":
      return "video-2-limfa";

    case "video-massage-level3":
      return "video-3-osanka";

    case "video-massage-level4":
      return "video-4-buccal-massage";

    case "video-massage-level5":
      return "video-5-guasha-massage";

    case "video-massage-level6":
      return "video-6-cellulite";

    case "video-massage-level7":
      return "video-7-mewing";

    case "video-massage-level8":
      return "video-8-taping";

    case "video-massage-level9":
      return "video-9-body-taping";
  }
  return null;
};
