/*
    聚合管道阶段
        $project - 对输入的文档进行再次投影
        $match   - 对输入的文档进行筛选
        $limit   - 筛选出管道内的前N篇文档
        $skip    - 跳过管道内的前N篇文档
        $unwind  - 展开输入文档中的数组字段
            db.accounts.aggregate([
                {
                    $unwind:{
                        path:"$currency", // path代表要展开的数组字段
                        includeArrayIndex:"currency",  // includeArrayIndex代表item在原array中的index
                        preserveNullAndEmptyArrays:true // preserveNullAndEmptyArrays值为true时,在展开数组时会保留注意点中通不过$unwind阶段的文档
                    } 
                }
            ])
            注意点 当$unwind时 文档所对应的字段不存在,为null或者是一个空数组, 这些文档是通不过该阶段的
            
        $sort    - 对输入文档进行排序
             db.accounts.aggregate([
                {
                    $sort:{
                        balance:1 // 1:正序 -1:反序
                    } 
                }
            ])
            
        $lookup  - 对输入的文档进行查询操作
        $group   - 对输入文档进行分组
        $out     - 将管道中的文档输出
*/

db.accounts.update(
    {"name.firstName":"A"},
    {$set:{currency:["CNY","USD"]}}
)
db.accounts.update(
    {"name.firstName":"B"},
    {$set:{currency:"GBP"}}
)

db.accounts.aggregate([
    {
      $project: {
          _id:0
      }  
    },
    {
        $unwind:{
            path:"$currency",
            includeArrayIndex:"ccyIndex"
        } 
    }
])

db.accounts.insertMany([
    {name:{firstName:"C",lastName:"mac"},balance:52},
    {name:{firstName:"D",lastName:"mac"},balance:53,currency:null},
    {name:{firstName:"E",lastName:"mac"},balance:54,currency:[]}
])

db.accounts.aggregate([
    {
      $project: {
          _id:0
      }  
    },
    {
        $unwind:{
            path:"$currency",
            includeArrayIndex:"ccyIndex",
            preserveNullAndEmptyArrays:true
        } 
    }
])

db.accounts.aggregate([
    {
        $sort:{
            balance:-1
        } 
    }
])
