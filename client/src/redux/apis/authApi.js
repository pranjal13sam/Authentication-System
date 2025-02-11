import  apiClient  from "../../utils/apiClient.js";

export const register = (payload) => {
    return apiClient.post(`${apiClient.Urls.register}`, payload);
  };

export const login = (payload) => {
  return apiClient.post(`${apiClient.Urls.login}`, payload);
};

export const userData = () => {
    return apiClient.get(`${apiClient.Urls.userData}`,{},true);
  };
  

  export const isAuth = () => {
    return apiClient.get(`${apiClient.Urls.isAuth}`,{},true);
  };

  export const logout = () => {
    return apiClient.post(`${apiClient.Urls.logout}`,{},true);
  };
  
  
