/*
    文档的CRUD操作
        create:
            db.<collection>.insertOne()	
            db.<collection>.insertMany()	
            db.<collection>.insert()
        注意点:
            以下操作也会新增一个文档
                db.collection.update() when used with the upsert: true option.
                db.collection.updateOne() when used with the upsert: true option.
                db.collection.updateMany() when used with the upsert: true option.
                db.collection.findAndModify() when used with the upsert: true option.
                db.collection.findOneAndUpdate() when used with the upsert: true option.
                db.collection.findOneAndReplace() when used with the upsert: true option.
                db.collection.save().
*/


/*
    语法:
        db.collection.insertOne(
           <document>,
           {
              writeConcern: <document> 
           }
        )   
    参数:
        document 表示待插入的文档
        writeConcern 表示安全写级别,使用默认的即可
            安全写级别越高,丢失数据的风险就越低,但写入操作的延迟也就越高
            
    返回值:
        {
          "acknowledged": true,  // true表示安全写级别被开启
          "insertedId": "5dd9ea30061c802f30375dfa" // 被写入文档的主键
        }
    
    异常:  
        文档主键重复:
            {
                "message": "E11000 duplicate key error collection: test.users index: _id_ dup key: { _id: 1.0 }",
                "stack": "WriteError({\n\t\"index\" : 0,\n\t\"code\" : 11000,\n\t\"errmsg\" : \"E11000 duplicate key error collection: test.users index: _id_ dup key: { _id: 1.0 }\",\n\t\"op\" : {\n\t\t\"_id\" : 1,\n\t\t\"name\" : \"damu\",\n\t\t\"age\" : 18,\n\t\t\"wife\" : \"周冬雨\"\n\t}\n})\nError\n    at new _0x181c0b (evalmachine.<anonymous>:11:169945)\n    at _0x5ec51e (evalmachine.<anonymous>:11:222191)\n    at Object.EmsKt (evalmachine.<anonymous>:11:100430)\n    at _0x42b686 (evalmachine.<anonymous>:11:230816)\n    at Object.EnGHO (evalmachine.<anonymous>:11:110237)\n    at _0x32cd25.(anonymous function) [as execute] (evalmachine.<anonymous>:13:19020)\n    at DBCollection.(anonymous function).(anonymous function) (evalmachine.<anonymous>:13:52268)\n    at DBCollection.obj.(anonymous function) [as insertOne] (C:\\Users\\alienware\\AppData\\Local\\Programs\\nosqlbooster4mongo\\resources\\app.asar\\node_modules\\mb-mquery\\lib\\mquery.js:3123:20)\n    at evalmachine.<anonymous>:2:14\n    at Script.runInContext (vm.js:107:20)",
                "name": "WriteError",
                "code": 11000,
                "index": 0,
                "errmsg": "E11000 duplicate key error collection: test.users index: _id_ dup key: { _id: 1.0 }"
            }
    
    实例:
        db.products.insertOne( { item: "card", qty: 15 } );   // qty:quantity 数量的意思
*/
try{
   db.products.insertOne( { item: "card", qty: 15,price:20 } ); 
}catch(err){
    print(err)
}