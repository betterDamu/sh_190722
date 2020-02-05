/*
    db.<collection>.update(<query>,<update>,<options>)
        如果update文档不包含任何的更新操作符;update命令将会使用update文档
                                替换集合中所有复合query文档筛选条件的文档
                                
    更新操作符:
        文档更新操作符
            $set    更新或新增字段
            $unset  删除字段
            $rename 重命名字段(不能结合在数组上使用)
                    有移动位置的效果
                    
            $inc    加减字段值
            $mul    相乘字段值
            
            $min    比较减小字段值
            $max    比较增大字段值
                注意如果更新前后的数据类型不一样;update也会尝试去更改数据
                    最小 Null
                         Numbers (ints longs doubles decimals)
                         Symbol String
                         Object
                         Array
                         BinData
                         ObjectId
                         Boolean
                         Date
                         Timestamp
                         Regular Expression
*/
db.account.find()

db.account.update({name:"pcy4"},{name:"xxxx"})
db.account.update({age:8},{name:"zdyzdy"})
db.account.update({name:"zdy"},{$set:{balance:100000,contact:["15851802777","hb","china"]}})
db.account.update({name:"xxxx"},{$set:{test:"test"}})

db.account.update({name:"zdy"},{$set:{"contact.0":"15851802799"}})

db.account.update({name:"zdy"},{$set:{"contact.3":"女"}})
db.account.update({name:"zdy"},{$set:{"contact.5":"有钱"}})


db.account.update({name:"xxxx"},{$unset:{"test":"test"}})
db.account.update({name:"xxxx"},{$unset:{"contact.0":""}})

db.account.update({name:"xxxx"},{$rename:{"name":"联系方式"}})

db.account.update({"联系方式":"xxxx"},{$set:{name:"xxx",contact:["15851802777","hb","china"]}})

db.account.update({"name":"xxx"},{$set:{"info":{email:"130526@qq.com"}}})

db.account.update({"name":"xxx"},{$rename:{"contact.4.info.email":"email"}})

db.account.update({"name":"xxx"},{$rename:{"info.email":"email"}})






