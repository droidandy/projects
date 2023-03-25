import { SravniWidgetConfig } from 'types/SravniWidget';

const setSravniWidget = (config: SravniWidgetConfig) => {
  const script = document.createElement('script');
  script.src = config.src;
  config.dataAttributes.forEach((attr) => {
    script.dataset[attr.name] = attr.value;
  });
  document.querySelector('#sravniWidget')?.appendChild(script);
};

export { setSravniWidget };
