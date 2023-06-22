
const Tour = require('./../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')

const sendErr = (res, err) => {
  const message = err instanceof String ? err : err.toString()
  res.status(400).json({ status: "fail", message: message })
}
const sendData = (res, data) => {
  res.status(200).json({ status: "success", data: data })
}

exports.checkBody = (req, res, next) => {
  if (!req.body || !req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid Data, require name and price"
    })
  }
  next()
}

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingAverage,price'
  req.query.fields = 'name,price,ratingAverage,summary,difficulty'
  next();
}

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const tours = await features.query
    res.status(200).json(
      {
        status: "success",
        result: tours.length,
        data: {
          tours
        }
      })
  } catch (err) {
    sendErr(res, err)
  }
}

exports.getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    sendData(res, { tour })
  } catch (err) {
    sendErr(res, err);
  }
}

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    sendData(res, { tour });
  } catch (err) {
    sendErr(res, err);
  }
}
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,
      {
        new: true,
        runValidators: true
      }
    )
    sendData(res, { tour })
  } catch (err) {
    sendErr(res, err)
  }

}
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    sendData(res, { tour })
  } catch (err) {
    sendErr(res, err);
  }
}

