/*
    1. 创建索引
        db.collection.createIndex(<keys>,<options>)
            keys : 指定了创建索引的字段 
                单键索引{key:1,key:-1} 
                复合键索引{key:1,key2:-1} 
            options
                {
                    unique:true  // 索引唯一性
                }
                //如果文档中的某个字段出现了重复值,就不可以在这个字段上创建唯一性索引
                //如果新增的文档中不包含唯一性索引的字段,只有第一篇缺失该字段的文档可以被写入数据库,索引中该文档的键值默认为null
                
                {
                    sparse:true //索引的稀疏性
                }
                //只将包含索引键字段的文档加入到索引中(即使索引键字段值为null)
                
                {
                    expireAfterSeconds:20
                }
                //日期字段使用
                
    2. 查看索引
        db.collection.getIndexes()
        
    3. 删除索引
        db.collection.dropIndex(name)
        
    4.查看索引效果
        db.collection.explain().<method(....)>
            method:find update remove
            
            "winningPlan.stage" : COLLSCAN(全表扫描)
*/
db.users.explain().find({name:{$eq:"damu"}},{name:1})
db.users.explain().find({name:{$eq:"damu"}})
db.users.explain().find({age:{$eq:9}})
db.users.find()

db.users.createIndex({name:1},{unique:true})
db.users.createIndex({date:1},{expireAfterSeconds:5})
db.users.getIndexes()
db.users.dropIndex("date_1")



db.users.insert({
    name:"damu2787878",
    date:new Date()
})

db.users.insert({
    age:"damu2"
})






			