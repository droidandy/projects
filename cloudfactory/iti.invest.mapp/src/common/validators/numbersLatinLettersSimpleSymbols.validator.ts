export function numbersLatinLettersSimpleSymbols(value: any) {
  const reg = /^[\x30-\x39\x41-\x5a\x61-\x7a]+$/; //https://www.ascii-code.com/ промежутки 48-57, 65-90, 97-122
  return reg.test(value);
}
