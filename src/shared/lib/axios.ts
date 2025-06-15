import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_MODE === 'DEV' ? '' : 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
})

export default axiosInstance
