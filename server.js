process.on('uncaughtException', err => {
  console.log("uncaughtException", err)
  process.exit(1)
})
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })//必须最早调用

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE,
  {
    autoCreate: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    useFindAndModify: true
  },)
  .then((conn) => {
    console.log("connected success")
  })
  .catch(err => {
    console.log("connect error :", err)
    // process.exit(1);
  })

const app = require('./app')

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`server running on ${port}`)
})

// 默认异常处理
process.on('unhandledRejection', err => {
  console.log("unhandledRejection", err)
  server.close(() => {
    process.exit(1)
  })
})