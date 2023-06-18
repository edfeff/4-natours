const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })//必须最早调用

const app = require('./app')

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server running on ${port}`)
})