const express = require('express')
const morgan = require('morgan') //HTTP request logger middleware for node.js https://www.npmjs.com/package/morgan
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')


//1>  中间件
const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))

//2>api
// app.get("/api/v1/tours", getAllTours)
// app.post("/api/v1/tours", createTour)
// app.get("/api/v1/tours/:id", getTour)
// app.patch("/api/v1/tours/:id", updateTour)
// app.delete("/api/v1/tours/:id", deleteTour)
// 路由聚合
//2.1> routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;