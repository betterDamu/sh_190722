db.wx_journals.insertMany(
    [
        {
            index:1,
            type:100,
            journal_id: ObjectId("5e3ada0f8a410e2200081e2e")
        },
        {
            index:2,
            type:100,
            journal_id: ObjectId("5e3ada0f8a410e2200081e2d")
        },
        {
            index:3,
            type:200,
            journal_id: ObjectId("5e3ada0f8a410e2200081e32")
        },
        {
            index:4,
            type:200,
            journal_id: ObjectId("5e3ada0f8a410e2200081e31")
        },
        {
            index:5,
            type:200,
            journal_id: ObjectId("5e3ada0f8a410e2200081e30")
        },
        {
            index:6,
            type:200,
            journal_id: ObjectId("5e3ada0f8a410e2200081e2f")
        },
        {
            index:7,
            type:300,
            journal_id: ObjectId("5e3ada0f8a410e2200081e2c")
        },
        {
            index:8,
            type:300,
            journal_id: ObjectId("5e3ada0f8a410e2200081e2b")
        }
    ]
)

db.wx_sentences.insertMany(
    [
        {
            image:'images/movie.6.png',
            content: '心上无垢，林间有风',
            title:'未名',
            type:300
        },
        {
            image:'images/movie.2.png',
            content: '这个夏天又是一个毕业季',
            title:'未名',
            type:300
        }
    ]
)

db.wx_movies.insertMany(
    [
        {
            image:'images/movie.8.png',
            content: '人生不能像做菜，把所有的料准备好才下锅',
            title:'李安《饮食男女 》',
            type:100
        },
        {
            image:'images/movie.4.png',
            content: '在变换的生命里，岁月原来是最大的小偷',
            title:'罗启锐《岁月神偷》',
            type:100
        }
    ]
)

db.wx_musics.insertMany(
    [
        {
            image:'images/music.7.png',
            content: '无人问我粥可温 风雨不见江湖人',
            title:'月之门《枫华谷的枫林》',
            type:200,
            src:'http://music.163.com/song/media/outer/url?id=393926.mp3'
        },
        {
            image:'images/music.1.png',
            content: '你陪我步入蝉夏 越过城市喧嚣',
            title:'花粥 《纸短情长》',
            type:200,
            src:'http://music.163.com/song/media/outer/url?id=516076896.mp3'
        },
        {
            image:'images/music.3.png',
            content: '岁月长，衣裳薄',
            title:'杨千嬅《再见二丁目》',
            type:200,
            src:'http://music.163.com/song/media/outer/url?id=317245.mp3'
        },
        {
            image:'images/music.5.png',
            content: '许多人来来去去，相聚又别离',
            title:'好妹妹 《一个人的北京》',
            type:200,
            src:'http://music.163.com/song/media/outer/url?id=26427662.mp3'
        }
    ]
)


