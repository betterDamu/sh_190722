//Buffer的静态方法
const buf = Buffer.alloc(10);

//返回字符串包含的字节数 默认utf8
console.log(Buffer.byteLength("尚硅谷"));
console.log(Buffer.isBuffer(buf));



const buf1 = Buffer.from("我");
const buf2 = Buffer.from("爱");
const buf3 = Buffer.from("你");
const buf4 = Buffer.concat([buf1, buf2, buf3]);
console.log(buf4.toString());


