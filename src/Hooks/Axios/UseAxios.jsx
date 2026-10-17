import axios from 'axios'






const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://yafaa-hop-server.vercel.app';

const axiosPublic = axios.create({
    baseURL: API_BASE_URL
})

const UseAxios = () => {
  return axiosPublic
}

export default UseAxios