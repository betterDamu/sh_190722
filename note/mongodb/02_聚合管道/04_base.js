/*
    聚合管道阶段
        $project - 对输入的文档进行再次投影
        $match   - 对输入的文档进行筛选
        $limit   - 筛选出管道内的前N篇文档
        $skip    - 跳过管道内的前N篇文档
        $unwind  - 展开输入文档中的数组字段
        $sort    - 对输入文档进行排序
        $lookup  - 对输入的文档进行查询操作
        $group   - 对输入文档进行分组
            db.transactions.aggregate([
                {
                    $group:{
                        _id:"$currency", // 定义分组规则 当值为null时只会分一组
                        totalQty:{$sum:"$qty"}, //自定义字段 
                        totalNotional:{$sum:{$multiply: ["$price","$qty"]}},
                        avgPrice:{$avg:"$price"},
                        count:{$sum:1},
                        maxNotional:{$max:{$multiply: ["$price","$qty"]}},
                        minNotional:{$min:{$multiply: ["$price","$qty"]}},
                        arr:{$push:1}
                    } 
                }
            ])
        $out     - 将管道中的文档输出
            
            
*/

db.transactions.insertMany([
    {symbol:"600519",qty:100,price:576.4,currency:"CNY"},
    {symbol:"AMAZ",qty:10,price:133.8,currency:"USD"},
    {symbol:"AAPL",qty:20,price:51,currency:"USD"}
])

db.transactions.aggregate([
    {
        $group:{
            _id:"$currency", // 定义分组规则
            totalQty:{$sum:"$qty"}, //自定义字段 
            totalNotional:{$sum:{$multiply: ["$price","$qty"]}},
            avgPrice:{$avg:"$price"},
            count:{$sum:1},
            maxNotional:{$max:{$multiply: ["$price","$qty"]}},
            minNotional:{$min:{$multiply: ["$price","$qty"]}},
        } 
    }
])
