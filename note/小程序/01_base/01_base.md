# 小程序简介
        小程序提供了一个简单、高效的应用开发框架和丰富的组件及API，帮助开发者在微信中开发具有原生 APP 体验的服务.
    小程序的主要开发语言是 JavaScript ，小程序的开发同普通的网页开发相比有很大的相似性。对于前端开发者而言，
    从网页开发迁移到小程序的开发成本并不高，但是二者还是有些许区别的
    
        网页开发渲染线程和脚本线程是互斥的，这也是为什么长时间的脚本运行可能会导致页面失去响应，
    而在小程序中，二者是分开的，分别运行在不同的线程中。
        网页开发者可以使用到各种浏览器暴露出来的 DOM API，进行 DOM 选中和操作。而小程序的逻辑层和渲染层是分开的，
    逻辑层运行在 JSCore 中，并没有一个完整浏览器对象，因而缺少相关的DOM API和BOM API。这一区别导致了前端开发非常熟悉的一些库，
    例如 jQuery、 Zepto 等，在小程序中是无法运行的。同时 JSCore 的环境同 NodeJS 环境也是不尽相同，所以一些 NPM 的包在小程序中
    也是无法运行的。
    
       ​网页开发者需要面对的环境是各式各样的浏览器，PC 端需要面对 IE、Chrome、QQ浏览器等，在移动端需要面对Safari、Chrome以及 iOS、
    Android 系统中的各式 WebView 。而小程序开发过程中需要面对的是两大操作系统 iOS 和 Android 的微信客户端，
    以及用于辅助开发的小程序开发者工具，小程序中三大运行环境也是有所区别的，如表所示。
                运行环境	                逻辑层	                  渲染层
                iOS	                    JavaScriptCore	            WKWebView
                安卓	                    V8	                chromium定制内核
                小程序开发者工具	        NWJS	                Chrome WebView
            
    
# 开发准备
- 注册微信开发者账号(获取appid)
- 安装小程序的开发工具
  
# 小程序代码构成
> 所有的配置 与 样式都采用就近原则!!
```
    .wxml 后缀的 WXML 模板文件   
            类似于 html文件
    .wxss 后缀的 WXSS 样式文件   
            类似于 css文件 注册的样式自动应用到wxml文件上
    .js 后缀的 JS 脚本逻辑文件  
    .json 后缀的 JSON 配置文件
```
# 配置文件(json)
    JSON 是一种数据格式，并不是编程语言，在小程序中，JSON扮演的静态配置的角色
## 全局配置 app.json
> app.json 是当前小程序的全局配置，包括了小程序的所有页面路径、界面表现、网络超时时间、底部 tab 等
    
     属性	     类型	    必填	    描述	    
    pages	    string[]	 是	     页面路径列表	
    window	    Object	     否	     全局的默认窗口表现	
    tabBar      
### pages
> 数组的第一项代表小程序的初始页面（首页）。小程序中新增/减少页面，都需要对 pages 数组进行修改

    用于指定小程序由哪些页面组成，每一项都对应一个页面的 路径（含文件名） 信息。
    文件名不需要写文件后缀，框架会自动去寻找对于位置的 .json, .js, .wxml, .wxss 四个文件进行处理
    
### window
> 用于设置小程序的状态栏、导航条、标题、窗口背景色。

        属性	                        类型	    默认值	                描述
    navigationBarBackgroundColor	   HexColor	   #000000	        导航栏背景颜色，如 #000000
    navigationBarTextStyle	            string	    white	    导航栏标题颜色，仅支持 black / white
    navigationBarTitleText	            string		                    导航栏标题文字内容
    backgroundTextStyle	                string	    dark	    下拉 loading 的样式，仅支持 dark / light
    backgroundColor	                    HexColor	#ffffff	                窗口的背景色
    enablePullDownRefresh	            boolean	    false	            是否开启当前页面下拉刷新。
### tabBar
> 如果小程序是一个多 tab 应用（客户端窗口的底部或顶部有 tab 栏可以切换页面），
> 可以通过 tabBar 配置项指定 tab 栏的表现，以及 tab 切换时显示的对应页面。

    属性	                类型	    必填	默认值	                    描述
    list	                Array	    是		                tab 的列表，详见 list 属性说明，最少2个、最多5个 tab	
    color	                HexColor	是		                tab 上的文字默认颜色，仅支持十六进制颜色
    selectedColor	        HexColor	是		                tab 上的文字选中时的颜色，仅支持十六进制颜色	
    backgroundColor	        HexColor	是		                tab 的背景色，仅支持十六进制颜色	
    borderStyle	            string	    否	    black	        tabbar上边框的颜色， 仅支持 black / white	
    position	            string	    否	    bottom	        tabBar的位置，仅支持 bottom / top
    
    其中 list 接受一个数组，只能配置最少 2 个、最多 5 个 tab。tab 按数组的顺序排序，每个项都是一个对象，其属性值如下：
        pagePath	        string	    是	        页面路径，必须在 pages 中先定义
        text	            string	    是	        tab 上按钮文字
        iconPath	        string	    否	        图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，不支持网络图片。
                                                        当 postion 为 top 时，不显示 icon。
        selectedIconPath    string	    否	        选中时的图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，不支持网络图片。
                                                        当 postion 为 top 时，不显示 icon。
## 页面配置  
        属性	                    类型	     默认值	        描述	                
    navigationBarBackgroundColor	HexColor	#000000	    导航栏背景颜色，如 #000000	
    navigationBarTextStyle	        string	    white	    导航栏标题颜色，仅支持 black / white	
    navigationBarTitleText	        string		            导航栏标题文字内容
    enablePullDownRefresh	        boolean	    false	    是否开启当前页面下拉刷新。
    