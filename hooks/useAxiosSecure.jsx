import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default function useAxiosSecure() {
  const router = useRouter();

  useEffect(() => {
    axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem('access-token');
      if (token) config.headers.authorization = `Bearer ${token}`;
      return config;
    });

    axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          router.push('/login');
        }
        return Promise.reject(error);
      }
    );
  }, [router]);

  return axiosSecure;
}