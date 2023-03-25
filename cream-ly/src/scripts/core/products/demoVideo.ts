import { getVideoListRaw } from "./video";

export const getVimeoId = (
  handle: string,
  sku: string | null,
  lang: string = "ru"
): number | null => {
  if (lang == "en" || lang == "lv") return null;

  if (handle.includes("video")) return findDemoForVideo(handle);

  switch (handle) {
    case "flower-powder-my-skin":
      return 401627991;
    case "cream-my-skin":
    case "cream-my-skin-with-peptides":
      return 428082124;
    case "nourish-my-skin":
      return 404579703;
    case "exfoliate-my-skin":
      return 401635269;
    case "cream-my-body":
      if (sku == "SKU-cream-my-body-atopic") return 532198377;
      return 407967006;
    case "brush-my-body":
      return 404548994;
    case "clean-my-skin":
      return 650425255;
  }

  return null;
};

const findDemoForVideo = (videoHandle) => {
  const video = getVideoListRaw().find(({ handle }) => handle == videoHandle);
  return video ? video.demoVimeo.videoId : null;
};

/*
    version to get video id from locize
    const videoReviewsString = this.t(`products:${handle}.videoReviews`);
    const videoReviewsId = videoReviewsString.includes("[")
      ? JSON.parse(videoReviewsString)
      : null;
*/
