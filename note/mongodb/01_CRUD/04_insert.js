/* 
 语法:
    db.collection.insert(
       <document or array of documents>,
       {
         writeConcern: <document>,
         ordered: <boolean>
       }
    )
     

 注意点:
    文档主键具有唯一性,每次在进行写入操作时,若不提供文档主键 mongodb会自动生成文档主键
    可以通过ObjectID()方法查看文档主键的生成策略 12字节id,包含创建时间. 可以通过ObjectID().getTimestamp()
    命令查看主键生成的时间
        
    复合主键 : 一个文档可以作为另外一个文档的主键, 也得满足主键的唯一性. 文档字段的顺序不同是不会破坏唯一性的
 
    db.collection.insertOne 不支持explain命令
    db.collection.insertMany 不支持explain命令
    db.collection.insert 支持explain命令
*/

ObjectID()
ObjectID().getTimestamp()
