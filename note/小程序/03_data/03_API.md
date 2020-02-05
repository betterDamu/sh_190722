# 小程序网络请求注意点   
    在小程序/小游戏中使用网络相关的 API 时，需提前在服务器域名配置
         
#wx.request(Object object)
## object参数
    属性	            类型	                默认值	            必填	                说明
    url	                string		                                是	             开发者服务器接口地址
    data	        string/object/ArrayBuffer		                否	                请求的参数
    header	            Object		                                否	        设置请求的 header，header 中不能设置 Referer。
                                                                            content-type 默认为 application/json
    method	            string	                GET	                否	                    HTTP 请求方法   
    dataType	        string	                json	            否	                    返回的数据格式	
    responseType	    string	                text	            否	                    响应的数据类型	
    success	            function		                            否	                接口调用成功的回调函数	
    fail	            function		                            否	                接口调用失败的回调函数	
    complete	        function		                            否	                接口调用结束的回调函数（调用成功、失败都会执行）        
    
## 示例代码
       wx.request({
         url: 'test.php', // 仅为示例，并非真实的接口地址
         data: {
           x: '',
           y: ''
         },
         header: {
           'content-type': 'application/json' // 默认值
         },
         success(res) {
           console.log(res.data)
         }
       })                                                                   
       
#   wx.setNavigationBarTitle(Object object)
     动态设置当前页面的标题
     
     参数
        Object object
     属性	        类型	    默认值	    必填	    说明
     title	        string		            是	        页面标题
     success	    function		        否	        接口调用成功的回调函数
     fail	        function		        否	        接口调用失败的回调函数
     complete	    function		        否	        接口调用结束的回调函数（调用成功、失败都会执行）
     
     示例代码
         wx.setNavigationBarTitle({
           title: '当前页面'
         })       
# scroll-view组件
    可滚动视图区域。使用竖向滚动时，需要给<scroll-view>一个固定高度，通过 WXSS 设置 height
    属性	                类型	        默认值	    必填	    说明	      
    scroll-x	            boolean	        false	    否	    允许横向滚动	
    scroll-y	            boolean	        false	    否	    允许纵向滚动	
    bindscrolltolower	    eventhandle		            否	    滚动到底部/右边时触发	
# wx.showNavigationBarLoading()
    在当前页面显示导航条加载动画
# wx.hideNavigationBarLoading()
    在当前页面隐藏导航条加载动画  
# wx.stopPullDownRefresh(Object object)
    停止当前页面下拉刷新 
# icon组件
    图标。
      属性	类型	        默认值	    必填	                说明	    
      type	string		                是	            icon的类型，有效值：success, success_no_circle, info, warn, waiting, cancel, download, search, clear
      size	number/string	  23	    否	            icon的大小	
      color	string		                否	            icon的颜色，同css的color	 
# input组件
    输入框。该组件是原生组件，使用时请注意相关限制
  
        属性	                类型	            默认值	        必填	        说明	
        value	                string		                        是	        输入框的初始内容	
        type	                string	            text	        否	        input 的类型	
        placeholder	            string		                        是	        输入框为空时占位符	
        placeholder-class	    string	        input-placeholder	否	    指定 placeholder 的样式类	
        bindinput	            eventhandle		                    是	    键盘输入时触发，event.detail = {value, cursor, keyCode}，keyCode 为键值，2.1.0 起支持，处理函数可以直接 return 一个字符串，将替换输入框的内容。	1.0.0
        bindfocus	            eventhandle		                    是	    输入框聚焦时触发，event.detail = { value, height }，height 为键盘高度，在基础库 1.9.90 起支持	1.0.0
        bindblur	            eventhandle		                    是	    输入框失去焦点时触发，event.detail = {value: value}	1.0.0
        bindconfirm	            eventhandle		                    是	    点击完成按钮时触发，event.detail = {value: value}	1.0.0
    