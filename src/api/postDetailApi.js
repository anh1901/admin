import axiosClient from "./axiosClient";

class PostDetailApi {
  getAll = (postId) => {
    const url = "/Post/" + postId;
    return axiosClient.get(url);
  };
}
const postDetailApi = new PostDetailApi();
export default postDetailApi;
