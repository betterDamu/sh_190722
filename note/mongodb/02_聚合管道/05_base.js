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
        $out     - 将管道中的文档输出
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
                },
                {
                    $out:"output"
                }
            ])
    
    聚合管道的注意点
        顺序问题:  
            $project + $match   尽可能的优先执行$match
            $sort + $match   尽可能的优先执行$match
            
            $project + $skip  $skip会优先执行
        
        合并问题
            $sort + $limit 这俩个阶段之间如果没有夹杂着会改变文档数量的聚合阶段,那这俩个阶段就会合并
*/
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
    },
    {
        $out:"output"
    }
])
