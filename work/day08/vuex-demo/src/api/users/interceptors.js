import axios from "axios"
const usersAxios = axios.create({
  baseURL:"https://api.github.com",
  timeout:15000
})


usersAxios.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});


usersAxios.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});


export default usersAxios
