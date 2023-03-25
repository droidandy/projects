import fetch from './fetch';
import { sleep } from './lib';

const checkServers = [
  'https://icanhazip.com/',
  'https://api.ipify.org/',
  'https://v4.ident.me/',
  'https://ipv4bot.whatismyipaddress.com/',
];

export const isIP = (IP: string): boolean => /^(\d+\.){3}\d+$/.test(IP);

const getMyIP = async (uri: string, timeout = 60_000): Promise<string | undefined> => {
  try {
    const IP = await fetch(uri);
    if (isIP(IP)) {
      return IP;
    }
  } catch (err) {
    //
  }
  // If the IP is not received, we exit by timeout so that other requests can complete and show our IP
  await sleep(timeout);
  return null;
};

export const myIP = async (timeout = 60_000) => Promise.race(checkServers.map((url) => getMyIP(url, timeout)));
