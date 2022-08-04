import axios from "axios";
// import queryString from "query-string";
const axiosClient = axios.create({
  // baseURL: "http://ec2-52-221-205-151.ap-southeast-1.compute.amazonaws.com/api",
  //baseURL: "https://24hreportsystemapi.conveyor.cloud/api",
  baseURL: "https://domaintestapp.online/api",
  headers: {
    "Content-Type": "application/json",
  },
  // paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  //   handle token here
  return config;
});

axiosClient.interceptors.response.use(
  async (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    throw error;
  }
);
export default axiosClient;
