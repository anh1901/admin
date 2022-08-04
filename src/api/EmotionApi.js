import axiosClient from "./axiosClient";

class EmotionApi {
  sendEmotion = (params) => {
    const url = "/Emotion/EditEmotion";
    return axiosClient.put(url,params);
  };
  getEmotion = (params) => {
    const url = "/Emotion?PostId="+params.postId+"&UserId="+params.userId;
    return axiosClient.get(url);
  };
  getNumberOfLike = (params) => {
    const url = "/Emotion?PostId="+params.postId+"&EmotionStatus="+params.emotionStatus;
    return axiosClient.get(url);
  };
  
}
const emotionApi = new EmotionApi();
export default emotionApi;