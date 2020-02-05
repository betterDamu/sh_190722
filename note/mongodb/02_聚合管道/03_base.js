/*
    聚合管道阶段
        $project - 对输入的文档进行再次投影
        $match   - 对输入的文档进行筛选
        $limit   - 筛选出管道内的前N篇文档
        $skip    - 跳过管道内的前N篇文档
        $unwind  - 展开输入文档中的数组字段
        $sort    - 对输入文档进行排序
        $lookup  - 对输入的文档进行查询操作
            db.accounts.aggregate([
                {
                    $lookup:{
                        from:"forex",           // 同一个数据库中另一个集合的名字
                        localField:"currency",      // 管道中的字段
                        foreignField:"ccy",    // from提供集合中的字段
                        as:"forexData"               // 指定通过lookup阶段后为管道中的每个文档新增的数组字段  存放的是localField和foreignField相等的forex中的文档
                    } 
                }
            ])
            
            db.accounts.aggregate([
                {
                    $lookup:{
                        from:"forex",       // 同一个数据库中另一个集合的名字
                        let:"currency",     // 在pipeline中如果需要使用当前管道中的字段 需要在let中进行声明
                        pipeline:[{},{}],     // 声明 from指定的集合 所对应的管道阶段
                        as:"forexData"      // 指定通过lookup阶段后为管道中的每个文档新增的数组字段  存放的是pipeline筛选出的文档
                    } 
                }
            ])
        $group   - 对输入文档进行分组
        $out     - 将管道中的文档输出
*/

db.forex.insertMany([
    {ccy:"USD",rate:6.91,date:new Date("2019-10-1")},
    {ccy:"GBP",rate:7.91,date:new Date("2019-10-2")},
    {ccy:"CNY",rate:8.91,date:new Date("2019-10-3")}
])

db.accounts.aggregate([
    {
      $unwind: {
          path:"$currency"
      }  
    },
    {
        $lookup:{
            from:"forex",           // 同一个数据库中另一个集合的名字
            let:{ccy:"$currency"},
            pipeline:[
               {
                $match: {
                   $expr:{
                       $and:[
                            {$eq:["$date",new Date("2019-10-1")]},
                            {$eq:["$$ccy","$ccy"]}   
                        ] 
                   }
                } 
               }
            ], 
            as:"forexData"               // 指定通过lookup阶段后为管道中的每个文档新增的数组字段  存放的是localField和foreignField相等的forex中的文档
        } 
    }
])
