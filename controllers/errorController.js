const ApiError = require("../utils/appError")

const handleCastErrorDB = err => {
  const message = `无效的字段${err.path}:${err.value}`
  return new ApiError(message, 400)
}
const handleDuplicateFieldDB = err => {
  //TODO
  // const value = err.errmsg.match(//) 利用正则从errmsg字段中取出具体错误信息 
  const message = `重复的字段${err.path}:${err.value}`

  return new ApiError(message, 400)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack
  })
}
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    console.error("服务器错误", err)
    res.status(500).json({
      status: 'error',
      message: '出错了'
    })
  }
}
module.exports = (err, req, res, next) => {
  // console.log("错误统一处理")
  // console.log(err)
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV == 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV == 'production') {

    let error = { ...err }

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error)
    } else if (error.code === 11000) {//用户数据问题导致DB出错
      error = handleDuplicateFieldDB(error)
    }
    sendErrorProd(error, res)
  }
}

