module.exports = (err, req, res, next) => {
  // console.log("错误统一处理")
  // console.log(err)
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
}

