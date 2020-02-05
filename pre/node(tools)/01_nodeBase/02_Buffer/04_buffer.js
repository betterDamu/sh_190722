//Buffer的实例方法
/*
    buf.length：返回buf分配到的字节数。  length 属性不是不可变的。
    buf.toString()：将buf转为字符串 默认编码utf8
    buf.fill(val,start,end)：在buf的[start,end)区域平铺val
    buf.write(val,start)：从buf的start位开始填充val
    buf.equals(otherBuffer)：
        如果 buf 与 otherBuffer 具有完全相同的字节，则返回 true，否则返回 false。
    buf.indexOf(val)：
        buf中value 最后一次出现的索引,如果buf没包含 value 则返回 -1
    buf.copy(target,targetStart,sourceStart,sourceEnd)：
        target 要拷贝进的 Buffer
        targetStart  target 中开始拷贝进的偏移量。 默认: 0
        sourceStart  buf 中开始拷贝的偏移量。 默认: 0
        sourceEnd    buf 中结束拷贝的偏移量（不包含）。 默认: buf.length
*/

const buf = Buffer.alloc(10);
buf[0]=97;
buf[1]=98;
buf[2]=99;
buf.fill("de",3,7);
buf.write("eeee",6)
console.log(buf,buf.length)
console.log(buf.toString())


const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('ABC');
const buf3 = Buffer.from('ABCD');
// 输出: true
console.log(buf1.equals(buf2));
// 输出: false
console.log(buf1.equals(buf3));


const buf4 = Buffer.from('this is a buffer');
// 输出: 2
console.log(buf4.indexOf('is'));

const  buf5 = Buffer.alloc(20);
buf4.copy(buf5,0,0,buf4.length)
console.log(buf5,buf5.toString());







