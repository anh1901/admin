import axiosClient from "./axiosClient";

class UserApi {
  getAll = (params) => {
    const url = "/Account";
    return axiosClient.get(url, params);
  };
  getById = (params) => {
    const url = "/Account/GetAccount?UserId=" + params.id;
    return axiosClient.get(url);
  };
  update = (params) => {
    const url = "/Account/";
    return axiosClient.put(url, params);
  };
  getUser = (params) => {
    const url = "/Account/GetAccount?email=" + params.email;
    return axiosClient.get(url);
  };
}
const userApi = new UserApi();
export default userApi;
