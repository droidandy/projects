declare module 'simple-react-lightbox' {
  export type SRLWrapperImage = {
    src: string;
    thumbnail?: string;
    caption?: string | React.Node;
    width?: string | number;
    height?: string | auto;
  }
  type SRLWrapperOptions = {
    settings?: {
      autoplaySpeed?: number;
      disableKeyboardControls?: boolean;
      disablePanzoom?: boolean;
      disableWheelControls?: boolean;
      hideControlsAfter?: number | boolean;
      lightboxTransitionSpeed?: number;
      lightboxTransitionTimingFunction?: string | any[];
      overlayColor?: string;
      slideAnimationType?: string;
      slideSpringValues?: any[];
      slideTransitionSpeed?: number;
      slideTransitionTimingFunction?: string | any[];
    };
    buttons?: {
      backgroundColor?: string;
      iconColor?: string;
      iconPadding?: string;
      showAutoplayButton?: boolean;
      showCloseButton?: boolean;
      showDownloadButton?: boolean;
      showFullscreenButton?: boolean;
      showNextButton?: boolean;
      showPrevButton?: boolean;
      showThumbnailsButton?: boolean;
      size?: string;
    };
    caption?: {
      captionColor?: string;
      captionAlignment?: string;
      captionFontFamily?: string;
      captionFontSize?: string;
      captionFontStyle?: string;
      captionFontWeight?: number | string;
      captionContainerPadding?: string;
      captionTextTransform?: string;
      showCaption?: boolean;
    };
    thumbnails?: {
      showThumbnails?: boolean;
      thumbnailsAlignment?: string;
      thumbnailsContainerPadding?: string;
      thumbnailsContainerBackgroundColor?: string;
      thumbnailsGap?: string;
      thumbnailsOpacity?: number;
      thumbnailsPosition?: string;
      thumbnailsSize?: any[];
    };
    progressBar?: {
      backgroundColor?: string;
      fillColor?: string;
      height?: string;
      showProgressBar?: boolean;
    };
  }
  type SRLWrapperCallbacks = {
    onCountSlides?: (...args: any[]) => any;
    onLightboxClosed?: (...args: any[]) => any;
    onLightboxOpened?: (...args: any[]) => any;
    onSlideChange?: (...args: any[]) => any;
  }
  export type SRLWrapperProps = {
    options?: SRLWrapperOptions;
    callbacks?: SRLWrapperCallbacks;
    elements?: SRLWrapperImage[];
    customCaptions?: any[];
  };
  export function useLightbox(): {
    openLightbox: (slideIndex: number) => void;
    closeLightbox: () => void;
  };
  export class SRLWrapper extends React.Component<SRLWrapperProps, any> {
    new (props: any, context?: any)
  }
  export default class SimpleReactLightbox extends React.Component<any, any> {
    new (props: any, context?: any)
  }
}
