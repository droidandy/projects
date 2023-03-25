const ymapsApiKey = 'eb7111f8-ba6f-4c54-80b1-e859affc6618';

let mapInitialisation = false;

export const initMap = (onLoad?: () => void) => {
  const scripts = document.querySelectorAll('script');

  if (
    mapInitialisation ||
    Array.from(scripts).some((script) => {
      script.src.includes('api-maps.yandex.ru');
    })
  ) {
    return;
  }

  mapInitialisation = true;

  const ymapsScript = document.createElement('script');
  ymapsScript.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${ymapsApiKey}`;
  ymapsScript.setAttribute('type', 'text/javascript');
  ymapsScript.onload = () => {
    mapInitialisation = false;
    onLoad && onLoad();
  };

  const lastScript = scripts[scripts.length - 1];

  lastScript.parentNode!.insertBefore(ymapsScript, lastScript.nextSibling);
};
