import axiosClient from "./axiosClient";

class CategoryApi {
  getAllRoot = (params) => {
    const url = "/RootCategory";
    return axiosClient.get(url, params);
  };
  getByIdRoot = (params) => {
    const url = "/RootCategory/" + params.rootCategoryId;
    return axiosClient.get(url);
  };
  addRoot = (params) => {
    const url = "/RootCategory?rootType=" + params.rootType;
    return axiosClient.post(url);
  };
  updateRoot = (params) => {
    const url =
      "/RootCategory?id=" + params.id + "&rootType=" + params.rootType;
    return axiosClient.put(url);
  };
  deleteRoot = (params) => {
    const url = "/RootCategory?id=" + params.id;
    return axiosClient.delete(url);
  };
  getAllSub = (params) => {
    const url = "/Category";
    return axiosClient.get(url, params);
  };
  getByIdSub = (params) => {
    const url = "/Category/" + params.rootCategoryId;
    return axiosClient.get(url);
  };
  addSub = (params) => {
    console.log(params);
    const url = "/Category";
    return axiosClient.post(url, params);
  };
  deleteSub = (params) => {
    const url = "/Category?id=" + params.id;
    return axiosClient.delete(url);
  };
  updateSub = (params) => {
    const url = "/Category";
    return axiosClient.put(url, params);
  };
}
const categoryApi = new CategoryApi();
export default categoryApi;
