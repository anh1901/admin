import axiosClient from "./axiosClient";

class ReportApi {
  getAll = (params) => {
    const url = "/Report";
    return axiosClient.get(url, params);
  };
  getByStatus = (params) => {
    const url = "/Report?Status=" + params.status;
    return axiosClient.get(url);
  };
  getByStatusAndStaffID = (params) => {
    const url =
      "/Report?Status=" + params.status + "&StaffID=" + params.staffID;
    return axiosClient.get(url);
  };
  send = (params) => {
    const url = "/Report";
    return axiosClient.post(url, params);
  };
  updateReportEditor = (params) => {
    const url =
      "/Report/UpdateReportEditor?reportID=" +
      params.reportID +
      "&editorID=" +
      params.editorID;
    return axiosClient.put(url);
  };
  reportViewUpdate = (params) => {
    const url = "/ReportView";
    return axiosClient.post(url, params);
  };
  find = (params) => {
    const url = "/Report/" + params.id;
    return axiosClient.get(url);
  };
}
const reportApi = new ReportApi();
export default reportApi;
