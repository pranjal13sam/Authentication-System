import LocalStorage from "./localStorage.js";

export const apiUrl =
  import.meta.env.VITE_REACT_APP_URL || "http://localhost:4000";

const encodeQueryData = (params) =>
  "?" + new URLSearchParams(params).toString();

const getLocalToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const authToken = user?.token;
  return authToken ? `Bearer ${authToken}` : "";
};



const apiClient = {
  Urls: {
    apiUrl,
    register: `${apiUrl}/api/auth/register`,
    login: `${apiUrl}/api/auth/login`,
    userData: `${apiUrl}/api/user/data`,
    isAuth: `${apiUrl}/api/auth/is-auth`,
    logout: `${apiUrl}/api/auth/logout`,
  },

  make: function (url, method, params, auth, type) {
    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    let options = {
      method,
      headers,
      credentials: "include", 
    };

    if (method === "GET") {
      let queryParams = "";
      if (Object.keys(params || {}).length) {
        queryParams = encodeQueryData(params);
      }
      return fetch(url + queryParams, options)
        .then((response) => response.json())
        .catch((e) => e);
    } else {
      options.body = type === "file" ? params : JSON.stringify(params);
      return fetch(url, options)
        .then((response) => response.json())
        .catch((e) => e);
    }
  },

  get: function (url, params, auth) {
    return apiClient.make(url, "GET", params, auth);
  },

  post: function (url, params, auth, type) {
    return apiClient.make(url, "POST", params, auth, type);
  },

  put: function (url, params, auth) {
    return apiClient.make(url, "PUT", params, auth);
  },

  patch: function (url, params, auth) {
    return apiClient.make(url, "PATCH", params, auth);
  },

  delete: function (url, params, auth) {
    return apiClient.make(url, "DELETE", params, auth);
  },
};

export default apiClient;
