import axiosClient from "./axiosClient";

class CommentApi {
  getByPostId = (postId) => {
    const url = "/Comment?PostId=" + postId;
    return axiosClient.get(url);
  };
  sendComment = (params) => {
    const url = "/Comment";
    return axiosClient.post(url,params);
  };
  delete = (params) => {
    const url = "/Comment/"+params.commentId;
    return axiosClient.delete(url);
  };
  update = (params) => {
    const url = "/Comment";
    return axiosClient.put(url,params);
  };
}
const commentApi = new CommentApi();
export default commentApi;