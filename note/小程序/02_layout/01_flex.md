# flex简述
##容器
    display:flex(css 属性)
    控制主轴是哪一根及其方向
         flex-direction                         
    富裕空间管理
        主轴的富余空间
            justify-content                         
                flex-start 主轴的正方向                 
                flex-end   主轴的反方向                  
                center                                   
                space-between                           
                space-around  在项目的两边
        侧轴的富余空间    
            align-items                              
                flex-start 侧轴的正方向                  
                flex-end   侧轴的反方向                  
                center                                   
                baseline  跟基线有关
                stretch   等高布局(项目得没有显示的指定高度;auto)
    侧轴的方向
            flex-wrap
    把所有项目当做有关整体  多行/多列的侧轴富裕空间管理        
            align-content 
    控制主轴侧轴分别是哪一根及其方向
            flex-flow
           (flex-direction & flex-wrap的简写)
            
## 项目
    order          决定项目的顺序
    align-self     侧轴的富余空间管理(项目)
    flex-grow      默认值0   伸展因子                                    
    flex-shrink    默认值1   收缩因子                                    
    flex-basis     默认值auto(拿width或height的值)  伸缩基准值               
    flex:n         默认值n 1 0%  ; grow,shrink,basis的简写属性
    
