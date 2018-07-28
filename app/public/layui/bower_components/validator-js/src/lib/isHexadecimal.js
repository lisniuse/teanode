import assertString from './util/assertString';

const hexadecimal = /^[0-9A-F]+$/i;

export default function isHexadecimal(str) {
  assertString(str);
  return hexadecimal.test(str);
}
