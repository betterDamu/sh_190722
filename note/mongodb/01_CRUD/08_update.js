/*
    db.<collection>.update(<query>,<update>,<options>)
        如果update文档不包含任何的更新操作符;update命令将会使用update文档
                                替换集合中所有复合query文档筛选条件的文档
                                
    更新操作符:
        数组更新操作符
            $addToSet : 向数组中添加元素(如果添加的新值已经存在在数组中了,则addToSet不会重新添加)
            $push     : 向数组中添加元素
                
                
            $pop      : 从数组中移除元素(只能删除第一个(-1) / 最后一个(1) 元素)
                
                
            $pull     : 从数组中有选择的移除元素
            $pullAll  : 从数组中有选择的移除元素
                {$pull:{<filed>:<value>,....}}
                {$pullAll:{<filed>:[<value>,<value>],....}}
                注意点:对于$pull $pullAll,我们不再需要额外使用$elemMatch操作符去匹配元素了
            
*/

/*
    相同点: $addToSet 和 $push 都可以向数组中添加元素;
            如果指定的字段是一个已经存在的数组,那么就往这个数组中添加一个值
            如果指定的字段不是一个已经存在的数组,那么就新增一个数组字段;初始值为指定的值
            都可以结合$each使用
            
    
    不同点:
        $addToSet 往数组中添加都是唯一(必须要个数;顺序都相同)的值;$push可以添加相同的值
        
        $push可以结合$each搭配更强大的操作符
            $position : 指定插入的下标
            $sort: 排序1(正序) -1(倒序)
            $slice: 截取
            以上方法 打乱顺序后效果都是一致的
*/

db.account.update(
    {name:"yyy"},
    {
        $pull:{contact:[1,2,3]}
    }
)

db.account.update({name:"xxx"},{$pop:{contact:1}})

db.account.update({name:"xxx"},{$addToSet:{contact:"test"}})
db.account.update({name:"xxx"},{$addToSet:{contact2:"test"}})
db.account.update({name:"xxx"},{$addToSet:{contact:[1,2,3]}})
db.account.update({name:"xxx"},{$addToSet:{contact:{$each:[1,2,3]}}})

db.account.update({name:"xxx"},{$push:{contact:"test"}})
db.account.update({name:"xxx"},{$push:{contact2:"test"}})
db.account.update({name:"xxx"},{$push:{contact:[1,2,3]}})
db.account.update({name:"xxx"},{$push:{contact:{$each:[1,2,3]}}})
db.account.update({name:"xxx"},{
    $push:{
        contact:{
            $each:["a"]
            $position:-1
            $sort:1
        }
    }
})
db.account.update({name:"xxx"},{
    $push:{
        contact:{
            $each:[{key:1,val:1},{key:2,val:2},{key:3,val:3}]
            $sort:{val:-1}
        }
    }
})


//文档的复制
db.account.find({name:"xxx"},{_id:0})
            .forEach(function(doc){
                var newDoc = doc;
                newDoc.name = "yyy";
                db.account.insert(newDoc)
            })


// 内嵌数组
db.account.update({name:"xxx"},{$addToSet:{"contact.18":"test"}})
db.account.update({name:"xxx"},{$pop:{"contact.18":1}})








			