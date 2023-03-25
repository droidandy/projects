const loaderErrors: Record<string, string> = {
  'file-too-large': 'Превышен допустимый размер фотографии',
  'file-too-small': 'Размер фотографии ниже допустимого',
  'file-invalid-type': 'Недопустимый формат файла',
  'too-many-files': 'Достигнут лимит загружаемых фотографий',
  'upload-error': 'Не удалось сохранить фотографию',
};

interface LoaderError extends Error {
  errorsMap: Record<string, string>;
  code: string | null;
}
class LoaderErrorModel extends Error implements LoaderError {
  errorsMap;

  code;

  constructor(message: string, alt?: string) {
    super(message);
    this.errorsMap = loaderErrors;
    this.code = this.errorsMap[message] ? message : null;
    Object.defineProperty(this, 'name', {
      get: () => 'LoaderError',
    });
    Object.defineProperty(this, 'message', {
      get: () => this.errorsMap[message] || alt || message,
    });
    Object.setPrototypeOf(this, LoaderErrorModel.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface LoaderErrorConstructor {
  new (message: string, alt?: string): LoaderError;
  (message: string, alt?: string): LoaderError;
  readonly prototype: LoaderError;
}

const LoaderError = <LoaderErrorConstructor>function LoaderError(this: any, message: string, alt?: string) {
  return new LoaderErrorModel(message, alt);
};
Object.setPrototypeOf(LoaderError, LoaderErrorModel.prototype);

export default LoaderError;
