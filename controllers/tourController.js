
const Tour = require('./../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')

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

exports.getAllTours = catchAsync(
  async (req, res, next) => {
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
  }
)

exports.getTour = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    sendData(res, { tour })
  }
)

exports.createTour = catchAsync(
  async (req, res, next) => {
    const tour = await Tour.create(req.body);
    sendData(res, { tour });
  }
)
exports.updateTour = catchAsync(
  async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,
      { new: true, runValidators: true }
    )
    sendData(res, { tour })
  }
)

exports.deleteTour = catchAsync(
  async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    sendData(res, { tour })
  }
)
exports.getTourStats = catchAsync(
  async (req, res, next) => {
    const stat = await Tour.aggregate(
      [
        { $match: { ratingsAverage: { $gte: 4.5 } } },
        {
          $group: {
            // _id: '$difficulty', // 按照难度分组
            _id: { $toUpper: '$difficulty' },
            num: { $sum: 1 },
            numRating: { $sum: '$ratingsAverage' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          }
        },
        { $sort: { avgPrice: 1 } },
        { $match: { _id: { $ne: 'EASY' } } }
      ]
    )
    sendData(res, stat)
  }
)
exports.getMonthlyPlan = catchAsync(
  async (req, res, next) => {
    const year = req.params.year * 1
    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      { $match: { startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`), } } },
      { $group: { _id: { $month: '$startDates' }, numTourStats: { $sum: 1 }, tour: { $push: '$name' } } },
      { $addFields: { month: '$_id' } },
      { $project: { _id: 0 }, },
      { $sort: { numTourStats: -1 } },
      { $limit: 12 }
    ])
    sendData(res, { plan })
  }
)
