import axiosClient from "./axiosClient";

class PostApi {
  create = (params) => {
    const url = "/Post";
    return axiosClient.post(url, params);
  };
  editStatus = (params) => {
    const url = "/Post/EditIsPublic";
    return axiosClient.put(url, params);
  };
  getAll = (params) => {
    const url = "/Post";
    return axiosClient.get(url, { params });
  };
  getById = (params) => {
    const url = "/Post/" + params.id;
    return axiosClient.get(url);
  };
  getByIdAndStatus = (params) => {
    const url =
      "/Post?EditorID=" + params.EditorID + "&Status=" + params.Status;
    return axiosClient.get(url);
  };
  getByStatus = (params) => {
    const url = "/Post?Status=" + params.Status;
    return axiosClient.get(url);
  };
  updateViewCount = (params) => {
    const url = "/Post/UpdateViewCount";
    return axiosClient.put(url, params);
  };
  updateShareCount = (params) => {
    const url = "/Post/UpdateShareCount?PostID=" + params.postID;
    return axiosClient.put(url, params);
  };
}
const postApi = new PostApi();
export default postApi;
