// 把数据导入mongodb的脚本
(async () => {

  const mongoose = require('mongoose')
  const Mongoose = await mongoose.connect("mongodb://127.0.0.1:27017/natours?retryWrites=true",
    {
      autoCreate: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      useFindAndModify: true
    });
  if (Mongoose) {
    console.log("connected Mongoose success")
  } else {
    console.log("connected Mongoose fail")
    process.exit(1)
  }


  // readFile
  const fs = require('fs')
  const contents = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`))
  const nameset = new Set();
  const tours = new Array();
  contents.forEach(element => {
    if (element && element.name && !nameset.has(element.name)) {
      nameset.add(element.name)
      tours.push(element)
    }
  });
  // console.log(process.argv)
  // [
  // 'D:\\Program Files\\nvm\\data\\nodes\\node-v18.16.0-win-x64\\node.exe',
  // 'E:\\code\\nodes\\lession\\4-natours\\dev-data\\data\\import-dev-data.js'
  // ]
  const Tour = require('../../models/tourModel')

  const command = process.argv[2]

  if ('--import' == command) {
    await Tour.create(tours)
    const successDatas = await Tour.find()
    console.log("创建成功,共", successDatas.length, "条记录")
  } else if ('--delete' == command) {
    await Tour.deleteMany()
    console.log("删除成功")
  } else {
    await Tour.deleteMany()
    await Tour.create(tours)
    console.log("重置数据成功")
  }

  process.exit(0)
})();