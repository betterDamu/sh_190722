/**
 * Created by damu on 2018/5/11.
 */
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

var buf = Buffer.from('尚硅谷!');
for(let i=0;i<buf.length;i+=5){
    const b = Buffer.allocUnsafe(5);
    buf.copy(b,0,i);
    console.log(b.toString());
}


for(let i=0;i<buf.length;i+=5){
  const b = Buffer.allocUnsafe(5);
  buf.copy(b,0,i);
  console.log(decoder.write(b));
}