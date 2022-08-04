import axiosClient from "./axiosClient";

class LoginApi {
  getAll = (params) => {
    const url = "/Account/Login";
    console.log(params);
    return axiosClient.post(url, params);
  };
}
const loginApi = new LoginApi();
export default loginApi;
//  https://reportsystemapi.conveyor.cloud/api/Account/Login?Email=nhatvi1801%40gmail.com&Password=123
