const dataLayerNectarin = 'dataLayerNectarin';

export const pushToDataLayerNectarin = (...args: any) => {
  if (typeof window === 'object') {
    // @ts-ignore
    if (!window[dataLayerNectarin]) {
      // @ts-ignore
      window[dataLayerNectarin] = [];
    }

    // @ts-ignore
    window[dataLayerNectarin].push(...args);
  }
};

export const pushNectarinAnalytics = (eventIndex: number) => {
  const noscript = document.createElement('noscript');
  const img = document.createElement('img');
  pushToDataLayerNectarin('event', 'conversion', {
    allow_custom_scripts: true,
    send_to: `DC-10978310/_bauto${eventIndex}/banka0+standard`,
  });
  img.src = `https://ad.doubleclick.net/ddm/activity/src=10978310;type=_bauto${eventIndex};cat=banka0;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;gdpr=${'${GDPR}'};gdpr_consent=${'${GDPR_CONSENT_755}'};ord=1?`;
  img.width = 1;
  img.height = 1;
  img.alt = '';
  noscript.appendChild(img);
  document.body.appendChild(noscript);
};

/* Карта FLOODLIGHT-тэгов предоставленная Nectarin
названия из документа сохранены */
export enum NectarinEventsMap {
  // Тег перехода на сайт
  bankauto_media_user = 1,
  // Тег на кнопку Получить СМС код
  bankauto_media_2 = 2,
  // Тег на кнопку Отправить Код
  bankauto_media_2_1 = 3,
  // Тег на кнопку Зарегистрироваться
  bankauto_media_2_2 = 4,
  // Нажатие на кнопку Подробнее в листинге - не банкавто
  bankauto_media_3 = 5,
  // Нажатие на кнопку Подробнее в листинге - банкавто
  bankauto_media_4 = 6,
  // Забронировать Онлайн (в трейд-ин)
  bankauto_media_5_1 = 7,
  // Забронировать Онлайн (в кредит)
  bankauto_media_5_2 = 8,
  // Забронировать Онлайн (в трейд-ин и в кредит)
  bankauto_media_5_3 = 9,
  // Забронировать Онлайн (без трейд-ин и не в кредит)
  bankauto_media_5_4 = 10,
  // Получить лучшую цену (в трейд-ин)
  bankauto_media_6_1 = 11,
  // Получить лучшую цену (в кредит)
  bankauto_media_6_2 = 12,
  // Получить лучшую цену (в трейд-ин и в кредит)
  bankauto_media_6_3 = 13,
  // Получить лучшую цену (без трейд-ин и не в кредит)
  bankauto_media_6_4 = 14,
  // Забронировать онлайн - рассрочка
  bankauto_media_7 = 15,
  // получить СМС-код продажа своего авто
  bankauto_media_8 = 16,
  // получить СМС-код страхование
  bankauto_media_9 = 17,
}

export const initNectarinGoogleTag = () => {
  pushToDataLayerNectarin('js', new Date());
  pushToDataLayerNectarin('config', 'DC-10978310');
  pushNectarinAnalytics(NectarinEventsMap.bankauto_media_user);
};
