import { EDAuthPasswordHash } from '@invest.wl/core';
import CryptoJS, { lib } from 'crypto-js';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import MD5 from 'crypto-js/md5';
import sha512 from 'crypto-js/sha512';

export function encodeCrypto(data: string | lib.WordArray, password: string | lib.WordArray): string {
  password = typeof password === 'string' ? CryptoJS.enc.Utf8.parse(password) : password;
  const keySize = 256;
  const key = CryptoJS.SHA256(password, { keySize: keySize / 32 });
  const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');

  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

export function decodeCrypto(data: string, password: string): string {
  const keySize = 256;
  const key = CryptoJS.SHA256(password, { keySize: keySize / 32 });
  const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');

  const decrypted = CryptoJS.AES.decrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

export function passwordToHash(hashType: EDAuthPasswordHash, password: string, passwordSalt: string): string | lib.WordArray {
  switch (hashType) {
    case EDAuthPasswordHash.MD5:
      return MD5(password).toString();
    case EDAuthPasswordHash.SHA512:
      return sha512(password).toString();
    case EDAuthPasswordHash.HMACSHA512:
      const salt = CryptoJS.enc.Hex.parse(passwordSalt);
      return hmacSHA512(password, salt);
    default:
      return password;
  }
}
