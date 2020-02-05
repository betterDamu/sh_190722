/* 
    语法:
        db.collection.insertMany(
           [ <document 1> , <document 2>, ... ],
           {
              writeConcern: <document>,
              ordered: <boolean>
           }
        )
        
    参数:
        [ <document 1> , <document 2>, ... ] 表示待插入的文档数组
        
        writeConcern 表示安全写级别,使用默认的即可
            安全写级别越高,丢失数据的风险就越低,但写入操作的延迟也就越高 
            
        ordered 表示mongoDB是否决定要按顺序来写入这些文档(默认值为true)
            ordered:true  按顺序插入数组中的文档
            ordered:false 打乱文档的写入顺序,以便优化写入操作的性能
            
    返回值:
        {
          "acknowledged": true,
          "insertedIds": [             // 被写入文档的主键数组
            "5dda0335061c802f30375dfb",
            "5dda0335061c802f30375dfc"
          ]
        }
    
    异常:
        文档主键重复 
            {
            	"message" : "write error at item 1 in bulk operation",
            	"stack" : "script:11:16" +
                          "script:11:16" +
                          "script:13:4" +
                          "script:13:4" +
                          "script:1:10",
            	"name" : "BulkWriteError",
            	"nInserted" : 1,
            	"nUpserted" : 0,
            	"nMatched" : 0,
            	"nModified" : 0,
            	"nRemoved" : 0
            }
        & ordered:true   按顺序写入文档直到出错的文档
        & ordered:false  打乱写入顺序 除出错文档外 其余文档悉数写入
            
        
*/

try{
    db.users.insertMany([{
        _id:"七",
        name:"周冬雨",
        age:18
    },{
        _id:"一",
        name:"周冬雨",
        age:18
    },{
        _id:"三",
        name:"周冬雨",
        age:18
    }],{
        ordered:false
    })
}catch(err){
    print(err)
}