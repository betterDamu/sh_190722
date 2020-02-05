/*基本概念:
    mongodb     数据库管理系统
        database        数据库
            collection      集合
                document        文档
*/

/*数据库
    创建数据库:
        语法: use <database_name>
            如果数据库不存在，则创建数据库，否则切换到指定数据库。
            要显示刚创建的数据库需要向 数据库插入一些数据。
    显示当前所在数据库:
        语法: db
    列出可用数据库:
        语法: show dbs
    删除数据库:
        语法: db.dropDatabase()
*/

/*集合
    创建集合
        db.createCollection(name)
    列出数据库中可用集合
        show collections
    删除集合
        db.<collection>.drop()
        
    注意点:
        在mongodb中可以创建集合的命令有很多,
            大部分和创建文档相关的命令都会自动创建集合
                db.<collection>.insertOne()	
                db.<collection>.insertMany()	
                db.<collection>.insert()
*/

/*文档
    CRUD操作
    聚合操作
    索引
    一对一关系
    一对多关系
    多对多关系
    
    文档支持的数据类型( Bosn类型)
        Type	                Number  	Alias	    
        Double	                1	        “double”	双精度浮点值。用于存储浮点值。
        String	                2	        “string”    字符串。存储数据常用的数据类型。在 MongoDB 中，UTF-8 编码的字符串才是合法的。	 
        Object	                3	        “object”	用于内嵌文档
        Array	                4	        “array”	    用将数组
        Binary data	            5	        “binData”   二进制数据。用于存储二进制数据	 
        Undefined	            6	        “undefined”	用于创建undefined值。
        ObjectId	            7	        “objectId”	对象 ID。用于创建文档的 ID 
        Boolean	                8	        “bool”	    布尔值。用于存储布尔值（真/假）。
        Date	                9	        “date”	    日期时间。用 UNIX 时间格式来存储当前日期或时间。你可以指定自己的日期时间：创建 Date 对象，传入年月日信息。
        Null	                10	        “null”	    用于创建空值。
        Regular Expression	    11	        “regex”	    正则表达式类型。用于存储正则表达式
        Symbol	                14	        “symbol”	符号。该数据类型基本上等同于字符串类型，但不同的是，它一般用于采用特殊符号类型的语言
        JavaScript (with scope)	15  	    “javascriptWithScope”	 
        Timestamp	            17	        “timestamp”	 时间戳。记录文档修改或添加的具体时间
        Min key	                -1	        “minKey”	 将一个值与 BSON（二进制的 JSON）元素的最低值和最高值相对比。
        Max key	                127	        “maxKey”     将一个值与 BSON（二进制的 JSON）元素的最低值和最高值相对比。
*/



db.users.drop()