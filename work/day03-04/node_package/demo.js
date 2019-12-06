
var colors = require('colors');
console.log(colors)

/*console.log(colors.green('hello')); // outputs green text
console.log(colors.red.underline('i like cake and pies')) // outputs red underlined text
console.log(colors.inverse('inverse the color')); // inverses the color
console.log(colors.rainbow('OMG Rainbows!')); // rainbow
console.log(colors.trap('Run the trap')); // Drops the bass*/


console.log(module.paths)

/*
 node的包查找机制
    系统包(fs http)
    用户自定义的文件路径
        相对
        绝对路径
    第三方包(colors)
*/

/*node查找第三方包的机制
* module.paths:
      [ 'D:\\code\\code1\\上海_19_0722_3\\work\\day03&04\\node_package\\node_modules',
      'D:\\code\\code1\\上海_19_0722_3\\work\\day03&04\\node_modules',
      'D:\\code\\code1\\上海_19_0722_3\\work\\node_modules',
      'D:\\code\\code1\\上海_19_0722_3\\node_modules',
      'D:\\code\\code1\\node_modules',
      'D:\\code\\node_modules',
      'D:\\node_modules' ]

       1. 循环module.paths 找对应的文件夹
       2. 找到文件夹相关的package.json 中的main字段
       3. 如果main字段指向的不是一个有效的文件地址  那么node会继续找当前目录下的index
       4. 如果 2 3都没命中 则找不到包 报错
*
* */
