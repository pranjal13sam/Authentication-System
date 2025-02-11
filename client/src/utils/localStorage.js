function IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  
  var hours = 10; // to clear the localStorage after 10 hour
  var now = new Date().getTime();
  var setupTime = localStorage.getItem('setupTime');
  if (setupTime == null) {
    localStorage.setItem('setupTime', now);
  } else {
    if (now - setupTime > hours * 60 * 60 * 1000) {
      localStorage.clear();
      localStorage.setItem('setupTime', now);
    }
  }
  
  const LocalStorage = {
    getItem(key) {
      if (typeof localStorage !== 'undefined') {
        const value = localStorage.getItem(key);
        if (value !== '' && value !== undefined && value !== null) {
          if (IsJsonString(value)) {
            return JSON.parse(value);
          }
          return value;
        }
      }
      return null;
    },
    has(key) {
      return !!LocalStorage.getItem(key);
    },
    setItem(key, value) {
      if (typeof localStorage !== 'undefined') {
        const item = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, item);
      }
    },
    updateObject(key, change) {
      if (typeof localStorage !== 'undefined' && typeof change != 'undefined') {
        const data = LocalStorage.getItem(key);
        const update = change(Object.assign({}, data));
        if (typeof update != 'undefined' && update) {
          LocalStorage.setItem(key, update);
        }
      }
    },
  };
  
  export default LocalStorage;
  