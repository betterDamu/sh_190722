### vue指令
    {{}} , v-text , v-html , v-model
    v-on:click    @click
    v-bind:class  :class
    v-if v-else-if v-else v-show  v-for
    v-pre v-cloak v-once
### vue的选项
    el data methods computed components template props
    beforeCreate created beforeMount mounted beforeUpdate updated beforeDestroy destroyed
    render watch filters directives 
### vue的实例对象
    属性 : $root $el $options $data $refs
    方法 : $set $watch $mount $on $emit $once $off $destroye
### vue的构造函数
    属性 :  Vue.config.productionTip
    方法 :  Vue.set Vue.component Vue.filter Vue.directive
    
### day02注意点
    组件相关
      1. 组件命名的时候最好使用小写 有多个单词的时候使用 - 来连接 
      2. 组件的命名不能html5的标签产生冲突 也不能与html5的嵌套规则产生冲突(可以is属性解决)
      3. 非根组件的data必须是一个函数 不能使用el 要使用template来指定模板
      4. 非根组件的template 必须有一个包裹元素
      5. vue组件上定义的事件都是vue的自定义事件
      6. vue组件最后会被模板覆盖 在覆盖过程中vue组件上的非props特性会被继承
      7. 一个组件就是一个vue实例
     

    生命周期
        在vue的开发中 任何的业务逻辑都不要写在配置对象的外部 应该与生命周期钩子紧密结合
    
    vue的编译器 与 运行时
         编译器: 解析模板         (vue.js)
         运行时: 编译器以外的全部 (vue.runtime.js)
        
    vue的过渡动画
        v-leave 是无用的 只是为了api的对称性 完整性            
      