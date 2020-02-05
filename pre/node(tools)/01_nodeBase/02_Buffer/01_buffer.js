//创建buffer
var str = "hello 尚硅谷";
var buf = new Buffer(str,"utf-8");
console.log(buf,buf.length);

var buf2 = Buffer.from(str);
console.log(buf2,buf2.length,buf === buf2);

const buf3 = Buffer.from([1,2,3]);
console.log(buf3);

var buf4 = Buffer.alloc(10);
console.log(buf4);

const buf5 = Buffer.allocUnsafe(10);
console.log(buf5);


