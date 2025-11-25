const PREFIX = 'carhartt_';
/**
 * sessionStorage Helper
 */
export const sessionStore = {
  get(key) {
    const value = sessionStorage.getItem(PREFIX + key);
    if (value === null) return null;

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },

  set(key, value) {
    if (value === undefined) return;
    if (typeof value === 'object') {
      sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
    } else {
      sessionStorage.setItem(PREFIX + key, value.toString());
    }
  },

  remove(key) {
    sessionStorage.removeItem(PREFIX + key);
  },

  clear() {
    Object.keys(sessionStorage)
      .filter((_key) => _key.startsWith(PREFIX))
      .forEach((_key) => sessionStorage.removeItem(_key));
  },
};
