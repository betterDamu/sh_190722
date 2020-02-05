/*
    db.<collection>.update(<query>,<update>,<options>)
        如果update文档不包含任何的更新操作符;update命令将会使用update文档
                                替换集合中所有复合query文档筛选条件的文档
                                
    options:
        
        {
            multi:true, //到目前为止,update命令只能更新一篇文档
            upsert:true //没有匹配到文档 则创建新的
        }
            
*/

db.account.save({_id:ObjectId("5e13b9db27e73d0470407084"),name:"damu2",age:185})








			