import axiosClient from "./axiosClient";

class BoardApi {
  getAll = (params) => {
    const url = "/Board";
    return axiosClient.get(url, params);
  };
  addBoard = (params) => {
    const url = "/Board";
    return axiosClient.post(url, params);
  };
}
const boardApi = new BoardApi();
export default boardApi;
