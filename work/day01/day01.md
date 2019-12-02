vue的特点:
    声明式编程
    响应式数据
    数据双向绑定

编程思想
    数据驱动(mvvm)    
    

1. 指令
    数据绑定
        {{data中定义的数据}}  v-text="data中定义的数据"  v-html="data中定义的数据"
        v-model : 数据双向绑定
    事件
        v-on:事件名="methods中定义的方法"
        简写形式: v-on: 换成 @  
    样式
        v-bind:html预定义属性="data中定义的数据"    
        v-bind:class   /   :class
        v-bind:style   /   :style
    流程控制
        v-show
        v-if
        v-if-else
        v-else
        v-for
            数组的更新检测!!!!
    其他
        v-pre
        v-cloak   
        v-once     
        
2. 配置对象选项
    el
    data
    methods
    computed
    watch
            