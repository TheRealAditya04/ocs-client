import md5 from "crypto-js/md5";

export function hashPassword(password) {
  return md5(password).toString();
}
