import axiosClient from "./axiosClient";

class RegisterApi {
  createUser = (params) => {
    const url = "/Account/Register";
    return axiosClient.post(url, params);
  };
  checkUserRegister = (params) => {
    const url =
      "/Account/CheckAccountRegister?email=" +
      params.email +
      "&phoneNumber=" +
      params.phone;
    return axiosClient.get(url, params);
  };
}
const registerApi = new RegisterApi();
export default registerApi;
