function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    console.error(e.message);
    return false;
  }
  return true;
}

export const localStorageHealthCheck = async () => {
  if (typeof window === 'undefined') return;
  for (var i = 0; i < window.localStorage.length; ++i) {
    try {
      const result = window.localStorage.getItem(window.localStorage.key(i));
      if (!isJsonString(result)) {
        window.localStorage.removeItem(window.localStorage.key(i));
      }
      if (result && Object.keys(window.localStorage.key(i)).length == 0) {
        window.localStorage.removeItem(window.localStorage.key(i));
      }
    } catch (error) {
      window.localStorage.clear();
      // Handle the exception here
      console.error('window.localStorage Exception occurred:', error);
      // You can choose to ignore certain exceptions or take other appropriate actions
    }
  }
};

export const storePersist = {
  set: (key, state) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(state));
    }
  },
  get: (key) => {
    if (typeof window === 'undefined') {
      return false;
    }
    const result = window.localStorage.getItem(key);
    if (!result) {
      return false;
    } else {
      if (!isJsonString(result)) {
        window.localStorage.removeItem(key);
        return false;
      } else return JSON.parse(result);
    }
  },
  remove: (key) => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  },
  getAll: () => {
    if (typeof window !== 'undefined') {
      return window.localStorage;
    }
    return {};
  },
  clear: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  },
};

export default storePersist;
