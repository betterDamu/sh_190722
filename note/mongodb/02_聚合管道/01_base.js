/*聚合管道
    聚合管道可以理解为流水线的一整个工作阶段.这些工作阶段之间的合作是一环扣一环的.
    时序较早的工作阶段,它的工作成果会影响下一个工作阶段的工作结果,
    即下个阶段依赖于上一个阶段的输出，上一个阶段的输出成为本阶段的输入
    
    mongodb在2.2版本中引入了聚合框架,其基本功能有两个：
        对文档进行“过滤”，筛选出合适的文档
        对文档进行“变换”，改变文档的输出形式
        
        语法:
            db.collection.aggregate(pipeline, options)
        参数:
            pipeline	array	聚合管道阶段对应的数组
            options     document  配置项
                {
                    allowDiskUse:true
                }
                allowDiskUse:每个聚合管道阶段使用的内存不能超过100MB,如果数据量较大.为了防止聚合管道超出内存,可以启用allowDiskUse选项.
                                allowDiskUse会在内存不足时,将数据写入临时文件中
        返回值:
            文档游标
            
    聚合表达式
        1. 字段路径表达式  
            使用$来指示字段路径 : $<field>
            使用$和.来指示内嵌文档字段路径 : $<field>.<sub-field>
                $info.name
        
        2. 系统变量表达式
            使用$$来指示系统变量 : $$<variable> 
                $$CURRENT: 管道中的当前文档
        
        3. 常量表达式
            使用$literal:<value>指示常量值value
                $literal:"$info"
                
    聚合管道阶段
        $project - 对输入的文档进行再次投影
            db.accounts.aggregate([{
                $project:{
                    _id:0,     // 0代表不输出
                    balance:1, // 1代表输出
                    clientName:"$name.firstName", //聚合管道中的投影可以为文档新增属性
                    nameArray:["$name.firstName","$name.middleName","$name.lastName"] //$name.middleName的值为null
                }
            }])
        $match   - 对输入的文档进行筛选
            db.accounts.aggregate([{
                $match:{
                    $or:[
                            {"name.firstName":"A"},
                            {balance:{$gt:40,$lt:80}}
                        ]
                }
            }])
        $limit   - 筛选出管道内的前N篇文档
            db.accounts.aggregate([
                {$limit:1 }
            ])
        $skip    - 跳过管道内的前N篇文档
            db.accounts.aggregate([
                {$skip:1 }
            ])
        $unwind  - 展开输入文档中的数组字段
        $sort    - 对输入文档进行排序
        $lookup  - 对输入的文档进行查询操作
        $group   - 对输入文档进行分组
        $out     - 将管道中的文档输出
*/

db.accounts.insertMany([
    {name:{firstName:"A",lastName:"mac"},balance:50},
    {name:{firstName:"B",lastName:"mac"},balance:51},
])

db.accounts.aggregate([{
    $project:{
        _id:0,     // 0代表不输出
        balance:1, // 1代表输出
        clientName:"$name.firstName", //聚合管道中的投影可以为文档新增属性
        nameArray:["$name.firstName","$name.middleName","$name.lastName"] //$name.middleName的值为null
    }
}])


db.accounts.aggregate([{
    $match:{
        "name.firstName":"A"
    }
}])
db.accounts.aggregate([{
    $match:{
        $or:[
                {"name.firstName":"A"},
                {balance:{$gt:40,$lt:80}}
            ]
    }
}])


db.accounts.aggregate([
    {
         $match:{
            $or:[
                    {"name.firstName":"A"},
                    // {balance:{$gt:40,$lt:80}}
                ]
        }
    },
    {
        $project:{
            _id:0,     // 0代表不输出
            balance:1, // 1代表输出
            clientName:"$name.firstName", //聚合管道中的投影可以为文档新增属性
            nameArray:["$name.firstName","$name.middleName","$name.lastName"] //$name.middleName的值为null
        }
    }
])


db.accounts.aggregate([
    {$limit:1 }
])

db.accounts.aggregate([
    {$skip:1 }
])
