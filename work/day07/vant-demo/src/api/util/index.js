export default (axiosInstance,interfaceObj)=>{
  const api = {};
  for(name in interfaceObj){
    const {url,method,isForm} = interfaceObj[name];

    api[name]= async (data,config={}) => {
      //data必定是一个js对象
      // 数据转换!!!  将传入的js对象 按需求转化为data(json formdata)或者params
      let transformData=null;
      if(data && isForm){
        transformData = new FormData();
        for(let key in data){
          transformData.append(key,data[key])
        }
      }else{
        transformData = data
      }

      //请求的发送!!!
      let res = undefined;
      switch (method){
        case "get":
        case "delete":
          res = await axiosInstance({
            url,
            method,
            params:transformData
          });
          break;
        case "post":
        case "put":
          let configData = (config && (typeof config.data === "object")) ?config.data  :{};
          let endData ;
          if(isForm){
            for(let key in configData){
              transformData.append(key,configData[key]);
            }
            endData = transformData;
          }else {
            endData = Object.assign(transformData,configData)
          }
          res = await axiosInstance({
            url,
            method,
            data:endData
          })
          break;
      }

      return res;
    }
  }
  return api;
}
