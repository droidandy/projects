import ReactDOMServer from 'react-dom/server';
import { urlFor } from 'utils';
import DownloadHelper from './DownloadHelper';

export default class HtmlToPdfDownloader {
  constructor(component, options = {}) {
    this.component = component;
    this.options = options;
  }

  getDocumentHTML() {
    return ReactDOMServer.renderToStaticMarkup(this.component).replace(/<clipPath[^>]*>.*?<\/clipPath>/g, '');
  }

  download(url) {
    const fullParams = { html: this.getDocumentHTML() };

    if (__DEV__ && this.options.debug) {
      const newWindow = window.open();
      newWindow.document.write(`<html>${fullParams.html}</html>`);
      return Promise.resolve();
    }
    return new DownloadHelper(urlFor.statics(url)).post(fullParams);
  }
}
