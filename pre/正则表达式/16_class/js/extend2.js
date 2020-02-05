(function (w) {
    w.domExtend={};

    w.domExtend.getElementsByClassName = function(name){
        var res = [];
        //拿到页面上所有的节点
        var allNodes = document.getElementsByTagName("*");
        //遍历节点 观察每一个节点的class属性中有没有我们需要的className
        for(var i=0;i<allNodes.length;i++){
            //item1 item2 item3
            //item1    item2      item3
            //item item item item1   item2      item3
            var className = allNodes[i].className;
            var reg = new RegExp("\\b"+name+"\\b");
            if(reg.test(className)){
                res.push(allNodes[i])
            }
        }
        return res;
    }

})(window)