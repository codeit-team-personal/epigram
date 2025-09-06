import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // set-cookie 못 쓰는 상황이라 false
});

// 요청 인터셉터 - api요청 항상 accessToken 붙이기
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - accessToken 만료 시 refresh 요청
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, setTokens, clearAuth } = useAuthStore.getState();

    // 401 Unauthorized + refreshToken이 있을 경우
    if (
      error.response?.status === 401 &&
      refreshToken &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const res = await api.post(`/auth/refresh-token`, { refreshToken });

        const newAccessToken = res.data.accessToken;

        // 토큰 갱신
        setTokens(newAccessToken, refreshToken);

        // 헤더 다시 설정 후 원래 요청 재실행
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        clearAuth(); // refresh 실패 시 로그아웃 처리
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
