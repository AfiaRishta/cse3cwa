// lib/prefs.ts
export const THEME_KEY = "app.theme";              // new key
export const LEGACY_THEME_KEY = "cwa_theme";       // your old key name
export const MENU_ACTIVE_KEY = "app.menu.active";  // last visited path

export function safeGet(key: string) {
  try { return localStorage.getItem(key) ?? ""; } catch { return ""; }
}
export function safeSet(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch {}
}
