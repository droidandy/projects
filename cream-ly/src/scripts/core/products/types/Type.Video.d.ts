export {};

declare global {
  interface IVideosListItem {
    type?: string;
    title: string;
    handle?: string;
    price?: number;
    demoVimeo?: {
      imageId: number;
      videoId: number;
    };
    sku: string;
    variantId?: number | string;
    url?: string;
    pageUrl?: string;
    translation?: any;
  }

  interface IVideoPartsTiming {
    videoN: number;
    time: string;
  }
  interface ITranslations {
    additionalDetails: string;
    description: string;
    feedbacks: string[];
    shortDescription: string;
    shortTitle: string;
    title: string;
    videoParts: string[];
    videoPartsTimingsList: IVideoPartsTiming[];
  }
}
