(function (w) {
    w.domExtend={};

    w.domExtend.getElementsByClassName = function(name){
        var res = [];
        //拿到页面上所有的节点
        var allNodes = document.getElementsByTagName("*");
        //遍历节点 观察每一个节点的class属性中有没有我们需要的className
        for(var i=0;i<allNodes.length;i++){
            //<div class="item1 item2 item3"></div>
            var className = allNodes[i].className;
            //var classNameArr = className.split(" ");
            var classNameArr = className.split(/\s+/);
            console.log(classNameArr)
            for(var j=0;j<classNameArr.length;j++){
                if(classNameArr[j] === name){
                    res.push(allNodes[i]);
                    break;
                }
            }
        }
        return res;
    }

})(window)