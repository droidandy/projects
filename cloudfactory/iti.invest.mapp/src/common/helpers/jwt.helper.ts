import Base64 from 'crypto-js/enc-base64';
import UTF8 from 'crypto-js/enc-utf8';

export function jwtTokenExtractPayload(token: string): Record<string, any> {
  const parts = token.split('.');
  const plJson = Base64.parse(parts[1]).toString(UTF8);
  return JSON.parse(plJson);
}
