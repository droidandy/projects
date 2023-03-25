import React from 'react';
import i18n from 'i18next';

export function useLanguage() {
  const [lang, setLang] = React.useState(i18n.language);

  React.useEffect(() => {
    const onChange = () => {
      setLang(i18n.language);
    };
    i18n.on('languageChanged', onChange);
    return () => {
      i18n.off('languageChanged', onChange);
    };
  }, []);

  return lang;
}
