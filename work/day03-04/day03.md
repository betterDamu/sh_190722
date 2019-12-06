### 组件间数据的传递
    父向子
        父组件通过子组件标签上的自定义属性来传递数据
        子组件通过props选项(检验)来接受来自父组件的数据
    子向父
        1. 通过props  只不过父向子传递一个函数 子组件调用父组件传递过来的函数
                    通过函数的参数来进行数据传递
        2. 通过vue自定义事件  父组件在子组件的标签上绑定一个vue事件 子组件内部
                   在合适的事件触发该事件 通过事件回调函数的参数来进行数据传递            
    非父子
        1. 总线
        2. pubsub




### node包查找机制
     1. 循环module.paths 找对应的文件夹
     2. 找到文件夹相关的package.json 中的main字段
     3. 如果main字段指向的不是一个有效的文件地址  那么node会继续找当前目录下的index
     4. 如果 2 3都没命中 则找不到包 报错
     
### webpack包的查找机制(有别名)
     找别名指定的文件

### webpack包的查找机制(没有别名)
    1. 循环resolve.modules中指令的目录  找当前引用的包
    2. 找当前包的package.json文件 由resolve.mainFields所指定的字段
    3. 如果第2步没有成功找到一个文件  去找包底下由resolve.mainFiles 指定的文件
    4. 扩展名由resolve.extensions指定
    5. 以上都失败就报错!!!!
    
### vue-cli
    npm i vue-cli -g
    vue init webpack projectName
    set PORT=3000
    npm start
    windows中的环境变量:
        查看所有的环境变量 : set
        查看指定的环境变量 : set 变量名
        设置指定的环境变量 : set 变量名=值 (一次性)
        删除指定的环境变量 : set 变量名=
    
### todolist
    App.vue 
        todo-header
        todo-list
            todo-item
        todo-footer
        
    父向子:    
        App.vue     ---array:list--->   todo-list  ---object:item---> todo-item
        App.vue     ---number:list.length--->   todo-footer
    子向父:
        todo-header ---object:item---> App.vue 
    非父子:    
        todo-item   ---number:id---> App.vue
    
    
        