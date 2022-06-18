/* eslint-disable no-param-reassign */
import axios from "axios";

const axiosInstance = axios.create({
  timeout: 30000,
  header: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (res) => {
    console.log("🙂응답 성공", res);
    return res.data;
  },
  (error) => {
    console.log("😵응답 에러", error);
    throw error;
  },
);

export default axiosInstance;
