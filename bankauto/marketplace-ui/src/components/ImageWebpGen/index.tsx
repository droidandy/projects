import React, {
  DetailedHTMLProps,
  ElementType,
  FC,
  ImgHTMLAttributes,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import CircularProgress from '@marketplace/ui-kit/components/CircularProgress';
import { useLayoutEffect } from 'hooks/useLayoutEffectPoly';
import { useStyles } from './ImageWebpGen.styles';

interface RequiredWrapperProps {
  className?: string;
  children?: React.ReactNode;
}

interface WebpGenWrapperProps extends RequiredWrapperProps {
  src?: string;
}

const WebpGenWrapper: FC<WebpGenWrapperProps> = ({ src, className, children }) => {
  if (!src) {
    return <div className={className}>{children}</div>;
  }

  const srcArray = src.split('.');
  srcArray.pop();

  return (
    <picture className={className}>
      <source srcSet={`${srcArray.join('.')}.webp`} type="image/webp" />
      {children}
    </picture>
  );
};

type LoadingProgressProp = {
  loading: boolean;
  className?: string;
};

const ImgLoadingProgress = ({ loading, className }: LoadingProgressProp) => {
  const [progress, setProgress] = useState<null | boolean>(loading ? null : false);
  useEffect(() => {
    if (loading && progress === null) {
      setTimeout(() => {
        setProgress((v) => (v === null ? true : v));
      }, 500);
    } else if (loading !== progress) {
      setProgress(() => loading);
    }
  }, [loading, progress]);
  return progress ? (
    <div className={className}>
      <CircularProgress />
    </div>
  ) : null;
};

interface ImageProps<WP = {}, D extends ElementType = 'div'>
  extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  aspect?: string;
  loading?: 'eager' | 'lazy';
  wrapper?: D;
  wrapperProps?: WP;
  debug?: boolean;
}

export const Image = <P extends RequiredWrapperProps, D extends ElementType>({
  src,
  loading = 'lazy',
  className,
  wrapper,
  wrapperProps,
  ...rest
}: ImageProps<P, D>) => {
  const classes = useStyles();
  const objectFit = 'cover'; // stretch ? 'fill' : contain ? 'contain' : 'cover';
  const Wrapper = useMemo<ElementType>(() => wrapper || 'div', [wrapper]);
  const imageRef = useRef<HTMLImageElement>(null);
  const [onLoading, setLoading] = useState(loading === 'lazy');
  const [errored, setErrored] = useState(false);

  useLayoutEffect(() => {
    if (imageRef.current !== null) {
      if (imageRef.current.complete) {
        setLoading(false);
        setErrored(imageRef.current.naturalHeight === 0);
      } else {
        imageRef.current.addEventListener('load', () => {
          setLoading(false);
        });
        imageRef.current.addEventListener('error', () => {
          setErrored(true);
        });
      }
    }
  }, [imageRef]);

  const progress = useMemo(() => onLoading && !errored, [onLoading, errored]);

  return (
    <div className={classes.root}>
      <ImgLoadingProgress loading={progress} className={classes.loadingOverlay} />
      {/* A dirty hack to make lzloading more stable. Remove at your own risk. */}
      {errored ? <div className={classes.errorFallback} /> : null}
      <Wrapper {...(wrapperProps || {})} className={cx(classes.wrapper, wrapperProps?.className)}>
        <img
          src={src}
          className={cx(className, classes.image)}
          loading={loading}
          ref={imageRef}
          style={{ objectFit }}
          {...rest}
        />
      </Wrapper>
    </div>
  );
};

interface WebGenProps extends ImageProps {
  contain?: boolean;
  stretch?: boolean;
  fallbackImageUrl?: string;
  rootClassName?: string;
  lzConf?: {
    offset?: number;
    loaderSize?: number;
  } | null;
  handleLoad?(e: SyntheticEvent<HTMLImageElement, Event>): void;
  handleRef?: (ref: React.MutableRefObject<HTMLImageElement | null>) => void;
}

export const ImageWebpGen: FC<WebGenProps> = ({
  src,
  // ignore props, remove or enable later
  stretch,
  contain,
  lzConf,
  handleLoad,
  handleRef,
  fallbackImageUrl,
  rootClassName,
  ...props
}) => {
  return <Image wrapper={WebpGenWrapper} wrapperProps={{ src }} src={src} {...props} />;
};
