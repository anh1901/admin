import axiosClient from "./axiosClient";

class UpdateReportApi {
  update = (params) => {
    const url = "/Report/StatusUpdate";
    return axiosClient.put(url, params);
  };
  updateCategory = (params) => {
    const url = "/Report/CategoryUpdate";
    return axiosClient.put(
      url +
        "?id=" +
        params.id +
        "&categoryID=" +
        params.categoryId +
        "&staffID=" +
        params.staffId
    );
  };
}
const updateReportApi = new UpdateReportApi();
export default updateReportApi;
//  https://reportsystemapi.conveyor.cloud/api/Account/Login?Email=nhatvi1801%40gmail.com&Password=123
