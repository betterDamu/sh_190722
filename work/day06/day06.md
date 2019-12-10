### axios
    基本的请求语法
        axios({config})
        axios(url,{config})
        axios.get(url,{config})
        axios.post(url,data,{config})
    并发
         axios.all([]).then(axios.spread((val1,val2)=>{}))   
    axios实例
        axios.create({config})  
    config配置对象
        1. 全局配置  
        2. 实例配置
        3. 发送请求配置  
    axios拦截器  
      
### vant
    