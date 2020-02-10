// 小程序数据传递
// 1. js文件 --> wxml文件 : 
//   js文件中的 data: { key: val } key直接在wxml文件上使用  {{key}}

// 2. wxml --> wxml
//    模板的使用方向模板中传递数据 
//     < template data={{key:val}}></template>
//     < template data={{...obj }}></template>
//     使用 {{key}}

// 3. wxml ---> js
//  <view data-id="1" bind:Tap="handleTap"></view>
//  handleTap(ev){
//    var id = ev.currentTarget.dataset.id
//  }

// 4. url 中的query --> js
//    https://127.0.0.1/damu?name=damu&age=18
//    onLoad(query){
//      var name = query.name;
//      var age = query.age;
//    }




//组件 : view text image swiper swiper-item icon block
//配置 : 全局 Page
    // 生命周期
    // 数据仓库
    // 回调函数
    // 路由
    // 界面的展示
//指令
    // {{}}
    // wx:for
    // wx:if
    // wx:elif 
    // wx:else
    // wx:key
    // bind:tap      
//API
    // wx.navigateTo;
    // wx.redirectTo;
    // wx.request 
    // page.setData