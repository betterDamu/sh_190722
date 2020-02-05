# 基本的三个内置组件
## <view>  
    视图容器  
## <text>    
    基础内容 文本组件 
### text标签属性
      属性	        类型	    默认值	    必填	    说明	
    selectable	    boolean	    false	    否	    文本是否可选
## <image>    
    媒体内容 图片组件 支持JPG、PNG、SVG格式
    默认样式:
        image {
            width:320px;
            height:240px;
            display:inline-block;
            overflow:hidden;
        }
###image标签属性
    属性	类型	    默认值	    必填	    说明	    
    src	    string		            否	    图片资源地址   
    
# 轮播组件
## <swiper>  
    滑块视图容器。其中只可放置<swiper-item>组件，否则会导致未定义的行为  
###swiper标签属性
        属性	                类型	        默认值	            必填	            说明
    indicator-dots	            boolean	        false	            否	            是否显示面板指示点
    indicator-color	            color	    rgba(0, 0, 0, .3)	    否	            指示点颜色
    indicator-active-color	    color	        #000000	            否	            当前选中的指示点颜色
    autoplay	                boolean	        false	            否	            是否自动切换
    interval	                number	        5000	            否	            自动切换时间间隔
    duration	                number	        500	                否	            滑动动画时长	
    circular	                boolean	        false	            否	            是否采用衔接滑动	
    vertical	                boolean	        false	            否	            滑动方向是否为纵向
    current	                    number	        0	                否	            当前所在滑块的 index(从第几屏开始滑)
    easing-function	            string	      "default"	            否	            指定 swiper 切换缓动动画类型
    
    easing-function的可取值:
        default	        默认缓动函数	
        linear	        线性动画	
        easeInCubic	    缓入动画	
        easeOutCubic	缓出动画	
        easeInOutCubic	缓入缓出动画
## <swiper-item>    
    仅可放置在<swiper>组件中，宽高自动设置为100%