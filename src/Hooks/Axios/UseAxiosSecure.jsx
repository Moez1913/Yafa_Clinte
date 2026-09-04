import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import useAuth from '../useAuth';

const API_BASE_URL = 'https://yafaa-hop-server.vercel.app';

export const axiosSecure = axios.create({
    baseURL: API_BASE_URL
});

const UseAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOut } = useAuth();

    axiosSecure.interceptors.request.use(function (config) {
        const token = localStorage.getItem('access-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, async function (error) {
        return Promise.reject(error);
    });

    axiosSecure.interceptors.response.use(function (response) {
        return response;
    }, async (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('access-token');
            await logOut();
            navigate('/login');
        }
        return Promise.reject(error);
    });

    return axiosSecure;
};

export default UseAxiosSecure