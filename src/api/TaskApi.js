import axiosClient from "./axiosClient";

class TaskApi {
  getAll = (params) => {
    const url = "/Task?BoardId=" + params.BoardId;
    return axiosClient.get(url, params);
  };
  getAllByIdAndStatus = (params) => {
    const url =
      "/Task?EditorID=" + params.EditorID + "&Status=" + params.status;
    return axiosClient.get(url, params);
  };
  updateStatus = (params) => {
    const url = "/Task/StatusUpdate";
    return axiosClient.put(url, params);
  };
  getById = (params) => {
    const url = "/Task/" + params.id;
    return axiosClient.get(url);
  };
  create = (params) => {
    const url = "/Task";
    return axiosClient.post(url, params);
  };
  taskReviewFilter = (params) => {
    const url = "/Task/TaskReviewFilter?percent=" + params.percent;
    return axiosClient.put(url, params);
  };
}
const taskApi = new TaskApi();
export default taskApi;
