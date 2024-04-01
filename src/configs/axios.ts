import axios from "axios";

const axiosInstance = axios.create({
  timeout: 10000,
  baseURL: 'http://localhost:4000',
} );

export default axiosInstance;