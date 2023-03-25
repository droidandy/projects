import { Maybe } from '../apollo/requests';
import { Linking } from 'expo';

export const handleAppLink = (link?: Maybe<string>) => {
  if (!link) return;
  const parsed = Linking.parse(link);
  if (parsed.path) {
    const dest = Linking.makeUrl(parsed.path, parsed.queryParams || undefined);
    Linking.openURL(dest).catch(console.error);
  }
};
