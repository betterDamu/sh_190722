//获取与设置buf中的字节
const buf = Buffer.alloc(10);
console.log(buf,buf[0].toString("10"));
buf[0]=257;
console.log(buf,buf[0].toString("10"));
