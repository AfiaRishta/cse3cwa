// /lib/cookies.ts
export function setCookie(name: string, value: string, days = 14) {
  const d = new Date();
  d.setTime(d.getTime() + days * 864e5);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/`;
}

export function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .reduce((acc, cur) => {
      const [k, v] = cur.split("=");
      return k === name ? decodeURIComponent(v) : acc;
    }, "");
}
