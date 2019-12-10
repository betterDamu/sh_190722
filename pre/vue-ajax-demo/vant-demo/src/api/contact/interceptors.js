import axios from "axios";
import {Toast} from "vant"

const contactAxios = axios.create({
    baseURL:"http://localhost:9000/api",
    timeout:5000
})

contactAxios.interceptors.request.use((config)=>{
    Toast.loading({
        mask: true,
        message: '加载中...',
        duration:0,
        forbidClick:true
    })
    return config
},(err)=>{
    Toast.clear()
    Toast.fail('请求失败 请稍后重试');
    return Promise.reject(err)
})

contactAxios.interceptors.response.use((res)=>{
    Toast.clear()
    return res.data
},(err)=>{
    Toast.clear()
    Toast.fail('请求失败 请稍后重试');
    return Promise.reject(err)
})


export default contactAxios