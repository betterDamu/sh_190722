/*
    游标:
        db.collection.find(query, projection)
            此方法返回的是一个游标;在不迭代游标的情况下,只列出前20个文档
            游标函数:
                cursor.next()
                cursor.hasNext()
                cursor.forEach(<function>)
                cursor.limit(<number>) : number为0时代表全部返回
                cursor.skip(<offset>)
                cursor.count(<applySkipLimit>) : applySkipLimit是一个布尔值 默认为false
                    当applySkipLimit为false时, count方法不会考虑skip和limit的效果
                cursor.sort(<document>): document即{key:val}的形式;val只能取值1(正向) 或 -1(逆向)
                
            
            注意点:
                skip limit sort联合使用的问题
                    skip一定会比limit先执行
                    sort一定在skip limit前执行
    
    投影:
        projection本质也就是一个document 即{key:val}的形式;val取值1(显示;此时除了主键外的其他字段都是不显示的)  取值0(不显示)
        除了文档主键外,我们是不可以混合使用0和1的
        
        如果投影字段的值是数组的话,我们还可以使用$slice字段 通过指定val来代表返回几个元素
            $slice:1
            $slice:[1,2] :  skip(1) limit(2)
                
        如果投影字段的值是数组的话,我们还可以通过使用$elemMatch来返回数组中满足筛选条件的第一个元素
            $elemMatch:query
*/
db.account.find()

db.account.find({age:8,balance:0})
db.account.find({age:{$eq:8},balance:{$eq:0}})
db.account.find({$and:[{age:8},{balance:0}]})
db.account.find({$and:[{age:{$eq:8}},{balance:{$eq:0}}]})
db.account.find({$and:[{age:{$gt:8}},{age:{$lt:50}}]})

db.account.find({age:{$gt:8,$lt:50})
db.account.find({$or:[{age:{$gt:20}},{balance:{$gt:100}}])
db.account.find({$nor:[{age:{$gt:20}},{balance:{$gt:100}}])

db.account.find({contact:{$elemMatch:{$in:["bj","sh"]}}})


let data = db.account.find({});
while(data.hasNext()){
    print(data.next())
}


let data = db.account.find();
data.forEach(print)


db.account.find().limit(1);


db.account.find().limit(5).skip(2).sort({name:1})
db.users.find({name:{$not:{$ne:"周冬雨"}}})
db.users.find({$and:[{name:{$ne:"周冬雨"}},{name:{$eq:"damu"}}]})

