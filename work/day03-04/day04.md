### 插槽
    普通插槽
        <组件>                   组件的定义的template模板
            html片段                  <slot></slot>
        </组件>
    具名插槽
        <组件>                                组件的定义的template模板
            <html片段1 slot="a">                  <slot name="a"></slot>
            <html片段1 slot="b">                  <slot name="b"></slot>
        </组件>
    作用域插槽
         <组件>                                           组件的定义的template模板
            <html片段1 slot="a" slot-scope="obj1">                  <slot name="a"  data="data-a"></slot>
            <html片段1 slot="b" slot-scope="obj2">                  <slot name="b"  data="data-b"></slot>              
        </组件>
### 插槽的作用
    父组件可以向子组件传递html片段
    子组件可以向父组件传递数据
    基于以上的特性 父组件可以通过插槽来扩展子组件的功能,样式
        